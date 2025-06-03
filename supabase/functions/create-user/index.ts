
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify the user is authenticated and get their session
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      console.error('Auth error:', authError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if the user is an admin
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      console.error('User is not admin:', { userId: user.id, role: profile?.role })
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get the request body
    const { email, password, role } = await req.json()

    if (!email || !password || !role) {
      return new Response(
        JSON.stringify({ error: 'Email, password, and role are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!['student', 'teacher'].includes(role)) {
      return new Response(
        JSON.stringify({ error: 'Role must be either student or teacher' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Creating user:', { email, role })

    // Create the user with email confirmation disabled for admin-created users
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { role },
      email_confirm: true // Admin-created users are auto-confirmed
    })

    if (createError) {
      console.error('User creation error:', createError)
      
      // Handle specific error cases
      if (createError.message.includes('already been registered')) {
        return new Response(
          JSON.stringify({ error: 'A user with this email address already exists' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      return new Response(
        JSON.stringify({ error: createError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (newUser.user) {
      console.log('User created successfully:', newUser.user.id)
      
      // Wait a moment for the trigger to potentially create the profile
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Check if profile already exists from trigger
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', newUser.user.id)
        .single()

      if (!existingProfile) {
        console.log('No profile found from trigger, creating manually...')
        
        // Create the profile record explicitly using service role (bypasses RLS)
        const { data: profileData, error: profileError } = await supabaseAdmin
          .from('profiles')
          .insert({
            id: newUser.user.id,
            email: newUser.user.email,
            role: role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single()

        if (profileError) {
          console.error('Manual profile creation error:', profileError)
          
          // If profile creation fails, delete the user to maintain consistency
          await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
          
          return new Response(
            JSON.stringify({ error: 'Failed to create user profile: ' + profileError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } else {
          console.log('Profile created manually:', profileData)
        }
      } else {
        console.log('Profile already exists from trigger:', existingProfile)
      }

      // Create role-specific record (student or teacher)
      try {
        if (role === 'student') {
          const { data: studentData, error: studentError } = await supabaseAdmin
            .from('students')
            .insert({
              user_id: newUser.user.id,
              grade: null,
              parent_email: null,
              subjects: [],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single()

          if (studentError) {
            console.error('Student record creation error:', studentError)
            // Clean up user and profile if student creation fails
            await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
            return new Response(
              JSON.stringify({ error: 'Failed to create student record: ' + studentError.message }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
          console.log('Student record created:', studentData)

        } else if (role === 'teacher') {
          const { data: teacherData, error: teacherError } = await supabaseAdmin
            .from('teachers')
            .insert({
              user_id: newUser.user.id,
              subjects: [],
              department: null,
              hire_date: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single()

          if (teacherError) {
            console.error('Teacher record creation error:', teacherError)
            // Clean up user and profile if teacher creation fails
            await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
            return new Response(
              JSON.stringify({ error: 'Failed to create teacher record: ' + teacherError.message }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
          console.log('Teacher record created:', teacherData)
        }
      } catch (roleError) {
        console.error('Role-specific record creation error:', roleError)
        // Clean up user and profile if role-specific creation fails
        await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
        return new Response(
          JSON.stringify({ error: 'Failed to create role-specific record: ' + roleError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Return the complete user information
      return new Response(
        JSON.stringify({ 
          user: {
            id: newUser.user.id,
            email: newUser.user.email,
            role: role,
            created_at: newUser.user.created_at
          },
          message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully` 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Failed to create user' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error: ' + error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
