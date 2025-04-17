CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "modos" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre_anime" text NOT NULL,
	"numero_casillas" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partidas" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" text,
	"modo_id" integer,
	"fecha" timestamp DEFAULT now(),
	"puntuacion" integer
);
--> statement-breakpoint
CREATE TABLE "personajes" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"anime" text NOT NULL,
	"tier" text NOT NULL,
	"url_wiki" text NOT NULL,
	"imagen_url" text
);
--> statement-breakpoint
CREATE TABLE "personajes_partida" (
	"id" serial PRIMARY KEY NOT NULL,
	"partida_id" integer,
	"personaje_id" integer,
	"orden_asignado" integer,
	"es_correcto" boolean
);
--> statement-breakpoint
CREATE TABLE "rankings" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" text,
	"modo_id" integer,
	"puntuacion" integer,
	"fecha" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	"nombre_usuario" text NOT NULL,
	"fecha_registro" timestamp DEFAULT now(),
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_nombre_usuario_unique" UNIQUE("nombre_usuario")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partidas" ADD CONSTRAINT "partidas_usuario_id_user_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partidas" ADD CONSTRAINT "partidas_modo_id_modos_id_fk" FOREIGN KEY ("modo_id") REFERENCES "public"."modos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personajes_partida" ADD CONSTRAINT "personajes_partida_partida_id_partidas_id_fk" FOREIGN KEY ("partida_id") REFERENCES "public"."partidas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personajes_partida" ADD CONSTRAINT "personajes_partida_personaje_id_personajes_id_fk" FOREIGN KEY ("personaje_id") REFERENCES "public"."personajes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rankings" ADD CONSTRAINT "rankings_usuario_id_user_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rankings" ADD CONSTRAINT "rankings_modo_id_modos_id_fk" FOREIGN KEY ("modo_id") REFERENCES "public"."modos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;