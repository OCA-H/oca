-- The "admin" role is now "super_admin": only super admins get the admin panel and admin APIs.
UPDATE "users" SET "role" = 'super_admin', "updated_at" = now() WHERE "role" = 'admin';
