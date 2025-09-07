-- Assign admin role to the existing user
INSERT INTO public.user_roles (user_id, role) 
VALUES ('5b08c647-f89e-42ad-b48e-6f1b71d73168', 'admin'::app_role);