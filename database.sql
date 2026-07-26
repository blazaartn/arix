CREATE SCHEMA "public";
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"question_id" uuid,
	"comment_id" uuid,
	"image_url" text NOT NULL,
	"imagebb_id" varchar(255),
	"caption" varchar(255),
	"upload_order" integer DEFAULT 0,
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"question_id" uuid,
	"comment_id" uuid,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "likes_unique" UNIQUE("user_id","question_id","comment_id"),
	CONSTRAINT "likes_check_one_target" CHECK ((((question_id IS NOT NULL) AND (comment_id IS NULL)) OR ((question_id IS NULL) AND (comment_id IS NOT NULL))))
);
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"subject" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"status" varchar(50) DEFAULT 'unread',
	"is_from_user" boolean DEFAULT true,
	"admin_reply" text,
	"replied_at" timestamp,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "messages_status_check" CHECK (((status)::text = ANY ((ARRAY['unread'::character varying, 'read'::character varying, 'replied'::character varying, 'archived'::character varying])::text[])))
);
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"actor_id" uuid NOT NULL,
	"type" varchar(50) NOT NULL,
	"content" text NOT NULL,
	"question_id" uuid,
	"answer_id" uuid,
	"comment_id" uuid,
	"project_id" uuid,
	"link" text,
	"is_read" boolean DEFAULT false,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "notifications_type_check" CHECK (((type)::text = ANY ((ARRAY['like'::character varying, 'comment'::character varying, 'reply'::character varying, 'accepted'::character varying, 'question'::character varying, 'answer'::character varying, 'mention'::character varying, 'system'::character varying, 'project_approved'::character varying, 'project_rejected'::character varying])::text[])))
);
CREATE TABLE "project_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"submission_url" text NOT NULL,
	"status" varchar(50) DEFAULT 'pending',
	"feedback" text,
	"grade" integer,
	"xp_awarded" boolean DEFAULT false,
	"submitted_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"reviewed_at" timestamp,
	"reviewed_by" uuid,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "unique_user_project" UNIQUE("user_id","project_id"),
	CONSTRAINT "project_submissions_grade_check" CHECK (((grade >= 0) AND (grade <= 100))),
	CONSTRAINT "project_submissions_status_check" CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying, 'needs_revision'::character varying])::text[])))
);
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"instructions" text,
	"file_url" text,
	"xp_reward" integer DEFAULT 50,
	"is_active" boolean DEFAULT true,
	"created_by" uuid,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"view_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"subject_name" varchar(100),
	"code_content" text,
	"code_language" varchar(50) DEFAULT 'javascript'
);
CREATE TABLE "resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(255) NOT NULL,
	"description" text,
	"type" varchar(50) NOT NULL,
	"file_url" text NOT NULL,
	"subject" varchar(100),
	"year" varchar(10),
	"session" varchar(20),
	"section" varchar(50),
	"difficulty" varchar(20),
	"download_count" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"uploaded_by" uuid,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "resources_difficulty_check" CHECK (((difficulty)::text = ANY ((ARRAY['facile'::character varying, 'moyen'::character varying, 'difficile'::character varying, 'très difficile'::character varying])::text[]))),
	CONSTRAINT "resources_type_check" CHECK (((type)::text = ANY ((ARRAY['exam'::character varying, 'series'::character varying, 'exercice'::character varying, 'course'::character varying, 'correction'::character varying])::text[])))
);
CREATE TABLE "todos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"text" text NOT NULL,
	"completed" boolean DEFAULT false,
	"due_date" date,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "user_resource_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"resource_id" uuid NOT NULL,
	"status" varchar(20) DEFAULT 'not_started',
	"score" integer,
	"xp_awarded" boolean DEFAULT false,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "unique_user_resource" UNIQUE("user_id","resource_id"),
	CONSTRAINT "user_resource_progress_score_check" CHECK (((score >= 0) AND (score <= 100))),
	CONSTRAINT "user_resource_progress_status_check" CHECK (((status)::text = ANY ((ARRAY['not_started'::character varying, 'in_progress'::character varying, 'completed'::character varying])::text[])))
);
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" varchar(255) NOT NULL CONSTRAINT "users_email_key" UNIQUE,
	"name" varchar(255) NOT NULL,
	"google_id" varchar(255) CONSTRAINT "users_google_id_key" UNIQUE,
	"avatar_url" text,
	"xp_points" integer DEFAULT 0,
	"level" integer DEFAULT 1,
	"role" varchar(50) DEFAULT 'student',
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" timestamp,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "users_role_check" CHECK (((role)::text = ANY ((ARRAY['student'::character varying, 'professor'::character varying, 'admin'::character varying])::text[])))
);
CREATE TABLE "xp_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"xp_amount" integer NOT NULL,
	"action_type" varchar(50) NOT NULL,
	"reference_id" varchar(255),
	"description" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "xp_transactions_action_type_check" CHECK (((action_type)::text = ANY ((ARRAY['ask_question'::character varying, 'answer_question'::character varying, 'accepted_answer'::character varying, 'like_received'::character varying, 'comment'::character varying, 'reply'::character varying, 'mention'::character varying, 'project_submission'::character varying, 'project_approved'::character varying, 'resource_completed'::character varying, 'exam_completed'::character varying, 'series_completed'::character varying])::text[])))
);
CREATE UNIQUE INDEX "comments_pkey" ON "comments" ("id");
CREATE INDEX "idx_comments_created_at" ON "comments" ("created_at");
CREATE INDEX "idx_comments_question_created" ON "comments" ("question_id","created_at");
CREATE INDEX "idx_comments_question_id" ON "comments" ("question_id");
CREATE INDEX "idx_comments_user_id" ON "comments" ("user_id");
CREATE INDEX "idx_images_comment_id" ON "images" ("comment_id");
CREATE INDEX "idx_images_question_id" ON "images" ("question_id");
CREATE INDEX "idx_images_user_id" ON "images" ("user_id");
CREATE UNIQUE INDEX "images_pkey" ON "images" ("id");
CREATE INDEX "idx_likes_comment_id" ON "likes" ("comment_id");
CREATE INDEX "idx_likes_question_id" ON "likes" ("question_id");
CREATE INDEX "idx_likes_user_id" ON "likes" ("user_id");
CREATE UNIQUE INDEX "likes_pkey" ON "likes" ("id");
CREATE UNIQUE INDEX "likes_unique" ON "likes" ("user_id","question_id","comment_id");
CREATE INDEX "idx_messages_created_at" ON "messages" ("created_at");
CREATE INDEX "idx_messages_status" ON "messages" ("status");
CREATE INDEX "idx_messages_user_id" ON "messages" ("user_id");
CREATE UNIQUE INDEX "messages_pkey" ON "messages" ("id");
CREATE INDEX "idx_notifications_actor_id" ON "notifications" ("actor_id");
CREATE INDEX "idx_notifications_created_at" ON "notifications" ("created_at");
CREATE INDEX "idx_notifications_is_read" ON "notifications" ("is_read");
CREATE INDEX "idx_notifications_user_created" ON "notifications" ("user_id","created_at");
CREATE INDEX "idx_notifications_user_id" ON "notifications" ("user_id");
CREATE INDEX "idx_notifications_user_read" ON "notifications" ("user_id","is_read");
CREATE UNIQUE INDEX "notifications_pkey" ON "notifications" ("id");
CREATE INDEX "idx_pending_submissions" ON "project_submissions" ("id","submitted_at");
CREATE INDEX "idx_project_submissions_project_id" ON "project_submissions" ("project_id");
CREATE INDEX "idx_project_submissions_status" ON "project_submissions" ("status");
CREATE INDEX "idx_project_submissions_submitted_at" ON "project_submissions" ("submitted_at");
CREATE INDEX "idx_project_submissions_user_id" ON "project_submissions" ("user_id");
CREATE INDEX "idx_submissions_project_status" ON "project_submissions" ("project_id","status");
CREATE INDEX "idx_submissions_review" ON "project_submissions" ("status","submitted_at");
CREATE INDEX "idx_submissions_user_status" ON "project_submissions" ("user_id","status");
CREATE UNIQUE INDEX "project_submissions_pkey" ON "project_submissions" ("id");
CREATE UNIQUE INDEX "unique_user_project" ON "project_submissions" ("user_id","project_id");
CREATE INDEX "idx_active_projects" ON "projects" ("id","title","created_at");
CREATE INDEX "idx_projects_created_at" ON "projects" ("created_at");
CREATE INDEX "idx_projects_is_active" ON "projects" ("is_active");
CREATE INDEX "idx_projects_is_active_created" ON "projects" ("is_active","created_at");
CREATE INDEX "idx_projects_xp_reward" ON "projects" ("xp_reward");
CREATE UNIQUE INDEX "projects_pkey" ON "projects" ("id");
CREATE INDEX "idx_questions_created_at" ON "questions" ("created_at");
CREATE INDEX "idx_questions_created_at_desc" ON "questions" ("created_at");
CREATE INDEX "idx_questions_user_id" ON "questions" ("user_id");
CREATE INDEX "idx_questions_user_id_created" ON "questions" ("user_id","created_at");
CREATE INDEX "idx_questions_with_joins" ON "questions" ("created_at");
CREATE UNIQUE INDEX "questions_pkey" ON "questions" ("id");
CREATE INDEX "idx_resources_created_at" ON "resources" ("created_at");
CREATE INDEX "idx_resources_is_active" ON "resources" ("is_active");
CREATE INDEX "idx_resources_section" ON "resources" ("section");
CREATE INDEX "idx_resources_subject" ON "resources" ("subject");
CREATE INDEX "idx_resources_type" ON "resources" ("type");
CREATE INDEX "idx_resources_type_subject" ON "resources" ("type","subject","year");
CREATE INDEX "idx_resources_year" ON "resources" ("year");
CREATE INDEX "idx_resources_year_created" ON "resources" ("year","created_at");
CREATE UNIQUE INDEX "resources_pkey" ON "resources" ("id");
CREATE INDEX "idx_todos_due_date" ON "todos" ("due_date");
CREATE INDEX "idx_todos_user_completed" ON "todos" ("user_id","completed");
CREATE INDEX "idx_todos_user_id" ON "todos" ("user_id");
CREATE UNIQUE INDEX "todos_pkey" ON "todos" ("id");
CREATE INDEX "idx_user_progress_resource_id" ON "user_resource_progress" ("resource_id");
CREATE INDEX "idx_user_progress_status" ON "user_resource_progress" ("status");
CREATE INDEX "idx_user_progress_user_id" ON "user_resource_progress" ("user_id");
CREATE UNIQUE INDEX "unique_user_resource" ON "user_resource_progress" ("user_id","resource_id");
CREATE UNIQUE INDEX "user_resource_progress_pkey" ON "user_resource_progress" ("id");
CREATE INDEX "idx_users_created_at" ON "users" ("created_at");
CREATE INDEX "idx_users_email" ON "users" ("email");
CREATE INDEX "idx_users_google_id" ON "users" ("google_id");
CREATE INDEX "idx_users_level" ON "users" ("level");
CREATE UNIQUE INDEX "users_email_key" ON "users" ("email");
CREATE UNIQUE INDEX "users_google_id_key" ON "users" ("google_id");
CREATE UNIQUE INDEX "users_pkey" ON "users" ("id");
CREATE INDEX "idx_xp_transactions_created_at" ON "xp_transactions" ("created_at");
CREATE INDEX "idx_xp_transactions_user_id" ON "xp_transactions" ("user_id");
CREATE UNIQUE INDEX "xp_transactions_pkey" ON "xp_transactions" ("id");
ALTER TABLE "comments" ADD CONSTRAINT "comments_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE;
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "images" ADD CONSTRAINT "images_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE;
ALTER TABLE "images" ADD CONSTRAINT "images_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE;
ALTER TABLE "images" ADD CONSTRAINT "images_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "likes" ADD CONSTRAINT "likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE;
ALTER TABLE "likes" ADD CONSTRAINT "likes_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE;
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "messages" ADD CONSTRAINT "messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "project_submissions" ADD CONSTRAINT "project_submissions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE;
ALTER TABLE "project_submissions" ADD CONSTRAINT "project_submissions_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL;
ALTER TABLE "project_submissions" ADD CONSTRAINT "project_submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "projects" ADD CONSTRAINT "projects_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL;
ALTER TABLE "questions" ADD CONSTRAINT "questions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "resources" ADD CONSTRAINT "resources_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE SET NULL;
ALTER TABLE "todos" ADD CONSTRAINT "todos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "user_resource_progress" ADD CONSTRAINT "user_resource_progress_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resources"("id") ON DELETE CASCADE;
ALTER TABLE "user_resource_progress" ADD CONSTRAINT "user_resource_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "xp_transactions" ADD CONSTRAINT "xp_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
-- For questions
CREATE INDEX IF NOT EXISTS idx_questions_user_id ON questions(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject_name);

-- For comments
CREATE INDEX IF NOT EXISTS idx_comments_question_id ON comments(question_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- For likes
CREATE INDEX IF NOT EXISTS idx_likes_question_user ON likes(question_id, user_id);
CREATE INDEX IF NOT EXISTS idx_likes_comment_user ON likes(comment_id, user_id);

-- For notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);