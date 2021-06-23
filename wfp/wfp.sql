BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "users" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"login"	TEXT NOT NULL,
	"name"	TEXT NOT NULL,
	"email"	TEXT,
	"passwd"	TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS "workflows" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"name"	TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS "wftasks" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"workflow"	INTEGER NOT NULL,
	"order"	INTEGER NOT NULL,
	"task"	INTEGER NOT NULL,
	"data"	TEXT,
	FOREIGN KEY("workflow") REFERENCES "workflows"("id"),
	FOREIGN KEY("task") REFERENCES "tasks"("id")
);
CREATE TABLE IF NOT EXISTS "tasks" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"name"	TEXT NOT NULL,
	"workflow"	INTEGER,
	FOREIGN KEY("workflow") REFERENCES "workflows"("id")
);
CREATE TABLE IF NOT EXISTS "runs" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"workflow"	INTEGER NOT NULL,
	"user"	INTEGER NOT NULL,
	"state"	INTEGER NOT NULL,
	"usertask"	INTEGER,
	FOREIGN KEY("workflow") REFERENCES "workflows"("id"),
	FOREIGN KEY("usertask") REFERENCES "usertasks"("id"),
	FOREIGN KEY("user") REFERENCES "users"("id")
);
CREATE TABLE IF NOT EXISTS "usertasks" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"run"	INTEGER NOT NULL,
	"user"	INTEGER NOT NULL,
	"wftask"	INTEGER NOT NULL,
	"state"	INTEGER NOT NULL,
	"notes"	TEXT,
	FOREIGN KEY("run") REFERENCES "runs"("id"),
	FOREIGN KEY("user") REFERENCES "users"("id"),
	FOREIGN KEY("wftask") REFERENCES "wftasks"("id")
);
INSERT INTO "users" VALUES (1,'admin','Administrador','root@wf-processor.com','admin');
INSERT INTO "users" VALUES (2,'juanito','Juan Sánchez','juan.sanchez@mycomp.com','12345');
INSERT INTO "users" VALUES (3,'pepito','Pepe López','pepe.lopez@gmail.com','patata');
INSERT INTO "workflows" VALUES (1,'Proceso 1');
-----Añadimos varios procesos más
INSERT INTO "workflows" VALUES (2,'Proceso 2');
INSERT INTO "workflows" VALUES (3,'Proceso 3');
INSERT INTO "workflows" VALUES (4,'Proceso 4');

-----Las tareas del proceso 1
INSERT INTO "wftasks" VALUES (1,1,10,1,'Al Scrum Master');
INSERT INTO "wftasks" VALUES (2,1,20,4,'Reunión revisión del sprint');
INSERT INTO "wftasks" VALUES (3,1,30,3,'Requisitos software para las tareas del sprint.');
-----Las tareas del proceso 2
INSERT INTO "wftasks" VALUES (4,2,10,2,'Presupuesto');
INSERT INTO "wftasks" VALUES (5,2,20,1,'Enviar presupuesto');
-----Las tareas del proceso 3
INSERT INTO "wftasks" VALUES (7,3,10,6,'Diseñar sistema de tracking');
INSERT INTO "wftasks" VALUES (8,3,20,7,'Implementar sistema de traking');
INSERT INTO "wftasks" VALUES (9,3,30,9,'Realizar pruebas');
-----Las tareas del proceso 4
INSERT INTO "wftasks" VALUES (10,4,10,1,'Al Cliente');
INSERT INTO "wftasks" VALUES (11,4,10,10,'Pedir componentes electronicos');
INSERT INTO "wftasks" VALUES (12,4,20,3,'Al Scrum Master');

INSERT INTO "tasks" VALUES (1,'Enviar e-mail',NULL);
INSERT INTO "tasks" VALUES (2,'Redatar documento',NULL);
INSERT INTO "tasks" VALUES (3,'Revisar documento',NULL);
INSERT INTO "tasks" VALUES (4,'Planificar reunión',NULL);
INSERT INTO "tasks" VALUES (5,'Analizar funcionalidad',NULL);
INSERT INTO "tasks" VALUES (6,'Diseñar funcionalidad',NULL);
INSERT INTO "tasks" VALUES (7,'Implementar funcionalidad',NULL);
INSERT INTO "tasks" VALUES (8,'Redactar requisitos de sistema',NULL);
INSERT INTO "tasks" VALUES (9,'Diseñar pruebas de sistema',NULL);
INSERT INTO "tasks" VALUES (10,'Realizar pedido',NULL);
INSERT INTO "tasks" VALUES (11,'Enviar Factura',NULL);

INSERT INTO "runs" VALUES (1,1,2,2,NULL);

INSERT INTO "usertasks" VALUES (1,1,2,1,2,'');
INSERT INTO "usertasks" VALUES (2,1,2,2,1,NULL);
INSERT INTO "usertasks" VALUES (3,1,2,3,1,NULL);
CREATE INDEX IF NOT EXISTS "usertaskstate" ON "usertasks" (
	"user",
	"state"
);
COMMIT;
