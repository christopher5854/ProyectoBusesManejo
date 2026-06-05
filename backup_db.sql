--
-- PostgreSQL database dump
--

\restrict gsXkSFYjoi0RMR67Z47eyplZCT9koCN8HPagtTfJFG2agPh344kcomgxEcRULTI

-- Dumped from database version 17.10 (Debian 17.10-1.pgdg13+1)
-- Dumped by pg_dump version 17.10 (Debian 17.10-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: acceso_pasajero; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.acceso_pasajero (
    id integer NOT NULL,
    boleto_id integer,
    usuario_id integer,
    fecha_acceso timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tipo character varying(20) DEFAULT 'entrada'::character varying
);


ALTER TABLE public.acceso_pasajero OWNER TO postgres;

--
-- Name: acceso_pasajero_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.acceso_pasajero_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.acceso_pasajero_id_seq OWNER TO postgres;

--
-- Name: acceso_pasajero_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.acceso_pasajero_id_seq OWNED BY public.acceso_pasajero.id;


--
-- Name: asiento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asiento (
    id integer NOT NULL,
    bus_id integer NOT NULL,
    tipo_asiento_id integer,
    numero character varying(5) NOT NULL,
    piso smallint DEFAULT 1,
    disponible boolean DEFAULT true
);


ALTER TABLE public.asiento OWNER TO postgres;

--
-- Name: asiento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.asiento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asiento_id_seq OWNER TO postgres;

--
-- Name: asiento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asiento_id_seq OWNED BY public.asiento.id;


--
-- Name: boleto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.boleto (
    id integer NOT NULL,
    usuario_id integer,
    asiento_id integer,
    frecuencia_id integer,
    fecha_viaje date,
    codigo character varying(20),
    estado character varying(20) DEFAULT 'pendiente'::character varying,
    precio_final numeric(8,2),
    tipo_descuento_id integer,
    metodo_pago_id integer,
    referencia_pago character varying(100),
    comprobante_url character varying(300),
    qr_url character varying(300),
    fecha_compra timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    codigo_boleto character varying(50),
    cliente_id integer,
    precio_base numeric(8,2),
    descuento_aplicado numeric(8,2) DEFAULT 0,
    ciudad_abordaje_id integer,
    ciudad_destino_id integer,
    estado_pago character varying(20) DEFAULT 'pendiente'::character varying,
    referencia_bancaria character varying(100),
    ruta_id integer,
    fecha_pago timestamp without time zone,
    fecha_emision timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.boleto OWNER TO postgres;

--
-- Name: boleto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.boleto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.boleto_id_seq OWNER TO postgres;

--
-- Name: boleto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.boleto_id_seq OWNED BY public.boleto.id;


--
-- Name: bus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bus (
    id integer NOT NULL,
    cooperativa_id integer NOT NULL,
    numero_interno character varying(20),
    placa character varying(10) NOT NULL,
    marca_chasis character varying(80),
    marca_carroceria character varying(80),
    anio_fabricacion smallint,
    capacidad_total smallint NOT NULL,
    foto_url character varying(300),
    activo boolean DEFAULT true NOT NULL
);


ALTER TABLE public.bus OWNER TO postgres;

--
-- Name: bus_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bus_id_seq OWNER TO postgres;

--
-- Name: bus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bus_id_seq OWNED BY public.bus.id;


--
-- Name: ciudad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ciudad (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    provincia character varying(100)
);


ALTER TABLE public.ciudad OWNER TO postgres;

--
-- Name: ciudad_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ciudad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ciudad_id_seq OWNER TO postgres;

--
-- Name: ciudad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ciudad_id_seq OWNED BY public.ciudad.id;


--
-- Name: configuracion_app; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.configuracion_app (
    id integer NOT NULL,
    clave character varying(100) NOT NULL,
    valor text
);


ALTER TABLE public.configuracion_app OWNER TO postgres;

--
-- Name: configuracion_app_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.configuracion_app_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.configuracion_app_id_seq OWNER TO postgres;

--
-- Name: configuracion_app_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.configuracion_app_id_seq OWNED BY public.configuracion_app.id;


--
-- Name: cooperativa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cooperativa (
    id integer NOT NULL,
    nombre character varying(120) NOT NULL,
    ruc character(13),
    telefono character varying(20),
    email character varying(100),
    direccion character varying(200),
    logo_url character varying(300),
    activa boolean DEFAULT true NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cooperativa OWNER TO postgres;

--
-- Name: cooperativa_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cooperativa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cooperativa_id_seq OWNER TO postgres;

--
-- Name: cooperativa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cooperativa_id_seq OWNED BY public.cooperativa.id;


--
-- Name: frecuencia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.frecuencia (
    id integer NOT NULL,
    cooperativa_id integer NOT NULL,
    ciudad_origen_id integer NOT NULL,
    ciudad_destino_id integer NOT NULL,
    hora_salida time without time zone NOT NULL,
    duracion_estimada character varying(50),
    numero_resolucion character varying(60),
    precio numeric(8,2) NOT NULL,
    activa boolean DEFAULT true NOT NULL,
    tipo_viaje character varying(20) DEFAULT 'ordinario'::character varying NOT NULL
);


ALTER TABLE public.frecuencia OWNER TO postgres;

--
-- Name: frecuencia_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.frecuencia_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.frecuencia_id_seq OWNER TO postgres;

--
-- Name: frecuencia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.frecuencia_id_seq OWNED BY public.frecuencia.id;


--
-- Name: hoja_ruta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hoja_ruta (
    id integer NOT NULL,
    cooperativa_id integer NOT NULL,
    frecuencia_id integer NOT NULL,
    bus_id integer NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date,
    tipo character varying(20) DEFAULT 'manual'::character varying,
    activa boolean DEFAULT true NOT NULL
);


ALTER TABLE public.hoja_ruta OWNER TO postgres;

--
-- Name: hoja_ruta_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hoja_ruta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hoja_ruta_id_seq OWNER TO postgres;

--
-- Name: hoja_ruta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hoja_ruta_id_seq OWNED BY public.hoja_ruta.id;


--
-- Name: metodo_pago; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.metodo_pago (
    id integer NOT NULL,
    nombre character varying(60) NOT NULL
);


ALTER TABLE public.metodo_pago OWNER TO postgres;

--
-- Name: metodo_pago_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.metodo_pago_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.metodo_pago_id_seq OWNER TO postgres;

--
-- Name: metodo_pago_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.metodo_pago_id_seq OWNED BY public.metodo_pago.id;


--
-- Name: notificacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notificacion (
    id integer NOT NULL,
    usuario_id integer,
    titulo character varying(100),
    mensaje text,
    leida boolean DEFAULT false,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notificacion OWNER TO postgres;

--
-- Name: notificacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notificacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notificacion_id_seq OWNER TO postgres;

--
-- Name: notificacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notificacion_id_seq OWNED BY public.notificacion.id;


--
-- Name: parada_frecuencia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parada_frecuencia (
    id integer NOT NULL,
    frecuencia_id integer NOT NULL,
    ciudad_id integer NOT NULL,
    orden smallint NOT NULL,
    tiempo_parada integer
);


ALTER TABLE public.parada_frecuencia OWNER TO postgres;

--
-- Name: parada_frecuencia_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.parada_frecuencia_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.parada_frecuencia_id_seq OWNER TO postgres;

--
-- Name: parada_frecuencia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parada_frecuencia_id_seq OWNED BY public.parada_frecuencia.id;


--
-- Name: rol; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rol (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(200)
);


ALTER TABLE public.rol OWNER TO postgres;

--
-- Name: rol_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rol_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rol_id_seq OWNER TO postgres;

--
-- Name: rol_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rol_id_seq OWNED BY public.rol.id;


--
-- Name: ruta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ruta (
    id integer NOT NULL,
    frecuencia_id integer NOT NULL,
    bus_id integer NOT NULL,
    fecha_ruta date NOT NULL,
    estado character varying(20) DEFAULT 'programada'::character varying
);


ALTER TABLE public.ruta OWNER TO postgres;

--
-- Name: ruta_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ruta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ruta_id_seq OWNER TO postgres;

--
-- Name: ruta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ruta_id_seq OWNED BY public.ruta.id;


--
-- Name: tipo_asiento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_asiento (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL
);


ALTER TABLE public.tipo_asiento OWNER TO postgres;

--
-- Name: tipo_asiento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipo_asiento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipo_asiento_id_seq OWNER TO postgres;

--
-- Name: tipo_asiento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipo_asiento_id_seq OWNED BY public.tipo_asiento.id;


--
-- Name: tipo_descuento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_descuento (
    id integer NOT NULL,
    nombre character varying(80) NOT NULL,
    porcentaje smallint NOT NULL
);


ALTER TABLE public.tipo_descuento OWNER TO postgres;

--
-- Name: tipo_descuento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipo_descuento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipo_descuento_id_seq OWNER TO postgres;

--
-- Name: tipo_descuento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipo_descuento_id_seq OWNED BY public.tipo_descuento.id;


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    id integer NOT NULL,
    rol_id integer NOT NULL,
    cooperativa_id integer,
    cedula character(10) NOT NULL,
    nombres character varying(100) NOT NULL,
    apellidos character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    telefono character varying(20),
    password_hash character varying(255) NOT NULL,
    fecha_nacimiento date,
    discapacidad boolean DEFAULT false NOT NULL,
    porcentaje_discapacidad smallint,
    activo boolean DEFAULT true NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- Name: usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_id_seq OWNER TO postgres;

--
-- Name: usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_id_seq OWNED BY public.usuario.id;


--
-- Name: acceso_pasajero id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acceso_pasajero ALTER COLUMN id SET DEFAULT nextval('public.acceso_pasajero_id_seq'::regclass);


--
-- Name: asiento id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asiento ALTER COLUMN id SET DEFAULT nextval('public.asiento_id_seq'::regclass);


--
-- Name: boleto id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boleto ALTER COLUMN id SET DEFAULT nextval('public.boleto_id_seq'::regclass);


--
-- Name: bus id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bus ALTER COLUMN id SET DEFAULT nextval('public.bus_id_seq'::regclass);


--
-- Name: ciudad id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudad ALTER COLUMN id SET DEFAULT nextval('public.ciudad_id_seq'::regclass);


--
-- Name: configuracion_app id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_app ALTER COLUMN id SET DEFAULT nextval('public.configuracion_app_id_seq'::regclass);


--
-- Name: cooperativa id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cooperativa ALTER COLUMN id SET DEFAULT nextval('public.cooperativa_id_seq'::regclass);


--
-- Name: frecuencia id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.frecuencia ALTER COLUMN id SET DEFAULT nextval('public.frecuencia_id_seq'::regclass);


--
-- Name: hoja_ruta id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hoja_ruta ALTER COLUMN id SET DEFAULT nextval('public.hoja_ruta_id_seq'::regclass);


--
-- Name: metodo_pago id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metodo_pago ALTER COLUMN id SET DEFAULT nextval('public.metodo_pago_id_seq'::regclass);


--
-- Name: notificacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacion ALTER COLUMN id SET DEFAULT nextval('public.notificacion_id_seq'::regclass);


--
-- Name: parada_frecuencia id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parada_frecuencia ALTER COLUMN id SET DEFAULT nextval('public.parada_frecuencia_id_seq'::regclass);


--
-- Name: rol id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol ALTER COLUMN id SET DEFAULT nextval('public.rol_id_seq'::regclass);


--
-- Name: ruta id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ruta ALTER COLUMN id SET DEFAULT nextval('public.ruta_id_seq'::regclass);


--
-- Name: tipo_asiento id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_asiento ALTER COLUMN id SET DEFAULT nextval('public.tipo_asiento_id_seq'::regclass);


--
-- Name: tipo_descuento id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_descuento ALTER COLUMN id SET DEFAULT nextval('public.tipo_descuento_id_seq'::regclass);


--
-- Name: usuario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id SET DEFAULT nextval('public.usuario_id_seq'::regclass);


--
-- Data for Name: acceso_pasajero; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.acceso_pasajero (id, boleto_id, usuario_id, fecha_acceso, tipo) FROM stdin;
\.


--
-- Data for Name: asiento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asiento (id, bus_id, tipo_asiento_id, numero, piso, disponible) FROM stdin;
1	1	1	01	1	t
2	1	1	02	1	t
3	1	1	03	1	t
4	1	1	04	1	t
5	1	1	05	1	t
6	1	1	06	1	t
7	1	1	07	1	t
8	1	1	08	1	t
9	1	1	09	1	t
10	1	1	10	1	t
11	1	1	11	1	t
13	1	1	13	1	t
14	1	1	14	1	t
15	1	1	15	1	t
16	1	1	16	1	t
17	1	1	17	1	t
18	1	1	18	1	t
19	1	1	19	1	t
20	1	1	20	1	t
21	1	1	21	1	t
22	1	1	22	1	t
23	1	1	23	1	t
25	1	1	25	1	t
26	1	1	26	1	t
27	1	1	27	1	t
28	1	1	28	1	t
29	1	1	29	1	t
31	1	1	31	1	t
34	1	1	34	1	t
35	1	1	35	1	t
36	1	1	36	1	t
37	1	1	37	1	t
38	1	1	38	1	t
39	1	1	39	1	t
40	1	1	40	1	f
33	1	1	33	1	f
12	1	1	12	1	f
30	1	1	30	1	f
32	1	1	32	1	f
24	1	1	24	1	f
\.


--
-- Data for Name: boleto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.boleto (id, usuario_id, asiento_id, frecuencia_id, fecha_viaje, codigo, estado, precio_final, tipo_descuento_id, metodo_pago_id, referencia_pago, comprobante_url, qr_url, fecha_compra, codigo_boleto, cliente_id, precio_base, descuento_aplicado, ciudad_abordaje_id, ciudad_destino_id, estado_pago, referencia_bancaria, ruta_id, fecha_pago, fecha_emision) FROM stdin;
1	\N	40	\N	\N	\N	pendiente	12.50	\N	1	\N	\N	\N	2026-06-01 16:52:24.931331	BOL-1780332744931-5655	2	12.50	0.00	1	4	pendiente	\N	2	\N	2026-06-01 16:55:32.44083
2	\N	33	\N	\N	\N	pendiente	12.50	\N	3	\N	\N	\N	2026-06-01 16:53:00.292301	BOL-1780332780292-5633	2	12.50	0.00	1	4	pendiente	\N	2	\N	2026-06-01 16:55:32.44083
3	\N	12	\N	\N	\N	pendiente	12.50	\N	3	\N	/uploads/comprobante-3-1780332907557-536745599.jpeg	\N	2026-06-01 16:54:53.406256	BOL-1780332893406-5876	2	12.50	0.00	1	4	pagado	0321456987	2	2026-06-01 16:55:00.598023	2026-06-01 16:55:32.44083
4	\N	30	\N	\N	\N	pendiente	12.50	\N	3	\N	/uploads/comprobante-4-1780333061699-523845360.jpeg	\N	2026-06-01 16:57:32.44932	BOL-1780333052449-4343	2	12.50	0.00	1	4	pagado	0123456789	2	2026-06-01 16:57:36.479839	2026-06-01 16:57:32.44932
5	\N	32	\N	\N	\N	pendiente	12.50	\N	3	\N	/uploads/comprobante-5-1780333205351-938591478.jpeg	\N	2026-06-01 16:59:57.999305	BOL-1780333197999-3903	2	12.50	0.00	1	4	pagado	0123456789	2	2026-06-01 17:00:01.485522	2026-06-01 16:59:57.999305
6	\N	24	\N	\N	\N	pendiente	12.50	\N	3	\N	/uploads/comprobante-6-1780333458463-642706962.jpeg	\N	2026-06-01 17:04:11.581922	BOL-1780333451581-5899	2	12.50	0.00	1	4	pagado	0123654789	2	2026-06-01 17:04:14.653671	2026-06-01 17:04:11.581922
\.


--
-- Data for Name: bus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bus (id, cooperativa_id, numero_interno, placa, marca_chasis, marca_carroceria, anio_fabricacion, capacidad_total, foto_url, activo) FROM stdin;
1	1	B001	ABC-1234	Mercedes	\N	\N	40	\N	t
2	1	BUS-001	ABC1234	Volvo	Zhong Tong	2020	50	\N	t
3	1	101	TDH-1000	JAC	\N	\N	39	\N	t
\.


--
-- Data for Name: ciudad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ciudad (id, nombre, provincia) FROM stdin;
1	Quito	Pichincha
2	Guayaquil	Guayas
3	Cuenca	Azuay
4	Ambato	Tungurahua
5	Riobamba	Chimborazo
6	Latacunga	Cotopaxi
7	Loja	Loja
8	Ibarra	Imbabura
9	Santo Domingo	Santo Domingo de los Tsáchilas
10	Esmeraldas	Esmeraldas
11	Manta	Manabí
12	Portoviejo	Manabí
13	Machala	El Oro
14	Babahoyo	Los Ríos
15	Tulcán	Carchi
31	Guaranda	Bolívar
32	Azogues	Cañar
33	Puyo	Pastaza
34	Tena	Napo
35	Lago Agrio	Sucumbíos
\.


--
-- Data for Name: configuracion_app; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.configuracion_app (id, clave, valor) FROM stdin;
1	nombre_app	Flota Pelileo
2	logo_url	
3	color_primario	#E53935
\.


--
-- Data for Name: cooperativa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cooperativa (id, nombre, ruc, telefono, email, direccion, logo_url, activa, fecha_registro) FROM stdin;
1	Flota Pelileo	1891234560001	032123456	info@flotapelileo.com	\N	\N	t	2026-06-01 14:52:09.863575
\.


--
-- Data for Name: frecuencia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.frecuencia (id, cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, duracion_estimada, numero_resolucion, precio, activa, tipo_viaje) FROM stdin;
1	1	4	1	08:00:00	\N	RES-001	3.50	t	ordinario
2	1	1	4	10:00:00	\N	RES-002	3.50	t	ordinario
3	1	1	4	08:00:00	02:30:00	RES-QUITO-AMBATO	12.50	t	directo
\.


--
-- Data for Name: hoja_ruta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hoja_ruta (id, cooperativa_id, frecuencia_id, bus_id, fecha_inicio, fecha_fin, tipo, activa) FROM stdin;
1	1	1	1	2026-01-01	\N	manual	t
2	1	2	1	2026-01-01	\N	manual	t
3	1	2	2	2026-05-01	2026-12-31	manual	t
\.


--
-- Data for Name: metodo_pago; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.metodo_pago (id, nombre) FROM stdin;
1	Transferencia
2	Depósito
3	Efectivo
\.


--
-- Data for Name: notificacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notificacion (id, usuario_id, titulo, mensaje, leida, fecha) FROM stdin;
\.


--
-- Data for Name: parada_frecuencia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.parada_frecuencia (id, frecuencia_id, ciudad_id, orden, tiempo_parada) FROM stdin;
\.


--
-- Data for Name: rol; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rol (id, nombre, descripcion) FROM stdin;
1	admin	Administrador del sistema
2	cooperativa	Administrador de cooperativa
3	oficinista	Oficinista de cooperativa
4	personal_bus	Personal encargado del bus
5	cliente	Cliente del sistema
\.


--
-- Data for Name: ruta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ruta (id, frecuencia_id, bus_id, fecha_ruta, estado) FROM stdin;
1	2	2	2026-05-20	programada
2	2	2	2026-05-21	programada
3	2	2	2026-05-22	programada
4	2	2	2026-05-23	programada
5	2	2	2026-05-24	programada
6	2	2	2026-05-25	programada
7	2	2	2026-05-26	programada
8	2	2	2026-05-27	programada
9	2	2	2026-05-28	programada
10	2	2	2026-05-29	programada
\.


--
-- Data for Name: tipo_asiento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_asiento (id, nombre) FROM stdin;
1	Normal
2	VIP
3	Ejecutivo
\.


--
-- Data for Name: tipo_descuento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_descuento (id, nombre, porcentaje) FROM stdin;
1	Discapacidad	50
2	Tercera Edad	50
3	Menor	25
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (id, rol_id, cooperativa_id, cedula, nombres, apellidos, email, telefono, password_hash, fecha_nacimiento, discapacidad, porcentaje_discapacidad, activo, fecha_registro) FROM stdin;
1	1	\N	1234567890	Admin	Sistema	admin@buses.com	\N	$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	\N	f	\N	t	2026-06-01 14:52:09.866502
2	5	\N	0999999999	Cliente	Prueba	cliente@test.com	\N	$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	\N	f	\N	t	2026-06-01 16:46:22.581444
3	3	\N	1800000001	Oficinista	Prueba	oficinista@test.com	\N	$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	\N	f	\N	t	2026-06-01 16:47:44.249454
4	4	\N	1812345678	Chofer	Bus	personal@bus.com	\N	$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	\N	f	\N	t	2026-06-01 16:48:28.106526
\.


--
-- Name: acceso_pasajero_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.acceso_pasajero_id_seq', 1, false);


--
-- Name: asiento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asiento_id_seq', 40, true);


--
-- Name: boleto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.boleto_id_seq', 6, true);


--
-- Name: bus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bus_id_seq', 3, true);


--
-- Name: ciudad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ciudad_id_seq', 35, true);


--
-- Name: configuracion_app_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.configuracion_app_id_seq', 3, true);


--
-- Name: cooperativa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cooperativa_id_seq', 2, true);


--
-- Name: frecuencia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.frecuencia_id_seq', 3, true);


--
-- Name: hoja_ruta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hoja_ruta_id_seq', 3, true);


--
-- Name: metodo_pago_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.metodo_pago_id_seq', 3, true);


--
-- Name: notificacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notificacion_id_seq', 1, false);


--
-- Name: parada_frecuencia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.parada_frecuencia_id_seq', 1, false);


--
-- Name: rol_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rol_id_seq', 10, true);


--
-- Name: ruta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ruta_id_seq', 10, true);


--
-- Name: tipo_asiento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipo_asiento_id_seq', 6, true);


--
-- Name: tipo_descuento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipo_descuento_id_seq', 6, true);


--
-- Name: usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_id_seq', 4, true);


--
-- Name: acceso_pasajero acceso_pasajero_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acceso_pasajero
    ADD CONSTRAINT acceso_pasajero_pkey PRIMARY KEY (id);


--
-- Name: asiento asiento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asiento
    ADD CONSTRAINT asiento_pkey PRIMARY KEY (id);


--
-- Name: boleto boleto_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boleto
    ADD CONSTRAINT boleto_codigo_key UNIQUE (codigo);


--
-- Name: boleto boleto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boleto
    ADD CONSTRAINT boleto_pkey PRIMARY KEY (id);


--
-- Name: bus bus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bus
    ADD CONSTRAINT bus_pkey PRIMARY KEY (id);


--
-- Name: bus bus_placa_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bus
    ADD CONSTRAINT bus_placa_key UNIQUE (placa);


--
-- Name: ciudad ciudad_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudad
    ADD CONSTRAINT ciudad_nombre_key UNIQUE (nombre);


--
-- Name: ciudad ciudad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudad
    ADD CONSTRAINT ciudad_pkey PRIMARY KEY (id);


--
-- Name: configuracion_app configuracion_app_clave_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_app
    ADD CONSTRAINT configuracion_app_clave_key UNIQUE (clave);


--
-- Name: configuracion_app configuracion_app_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_app
    ADD CONSTRAINT configuracion_app_pkey PRIMARY KEY (id);


--
-- Name: cooperativa cooperativa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cooperativa
    ADD CONSTRAINT cooperativa_pkey PRIMARY KEY (id);


--
-- Name: cooperativa cooperativa_ruc_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cooperativa
    ADD CONSTRAINT cooperativa_ruc_key UNIQUE (ruc);


--
-- Name: frecuencia frecuencia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.frecuencia
    ADD CONSTRAINT frecuencia_pkey PRIMARY KEY (id);


--
-- Name: hoja_ruta hoja_ruta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hoja_ruta
    ADD CONSTRAINT hoja_ruta_pkey PRIMARY KEY (id);


--
-- Name: metodo_pago metodo_pago_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metodo_pago
    ADD CONSTRAINT metodo_pago_nombre_key UNIQUE (nombre);


--
-- Name: metodo_pago metodo_pago_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metodo_pago
    ADD CONSTRAINT metodo_pago_pkey PRIMARY KEY (id);


--
-- Name: notificacion notificacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacion
    ADD CONSTRAINT notificacion_pkey PRIMARY KEY (id);


--
-- Name: parada_frecuencia parada_frecuencia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parada_frecuencia
    ADD CONSTRAINT parada_frecuencia_pkey PRIMARY KEY (id);


--
-- Name: rol rol_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol
    ADD CONSTRAINT rol_nombre_key UNIQUE (nombre);


--
-- Name: rol rol_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol
    ADD CONSTRAINT rol_pkey PRIMARY KEY (id);


--
-- Name: ruta ruta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ruta
    ADD CONSTRAINT ruta_pkey PRIMARY KEY (id);


--
-- Name: tipo_asiento tipo_asiento_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_asiento
    ADD CONSTRAINT tipo_asiento_nombre_key UNIQUE (nombre);


--
-- Name: tipo_asiento tipo_asiento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_asiento
    ADD CONSTRAINT tipo_asiento_pkey PRIMARY KEY (id);


--
-- Name: tipo_descuento tipo_descuento_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_descuento
    ADD CONSTRAINT tipo_descuento_nombre_key UNIQUE (nombre);


--
-- Name: tipo_descuento tipo_descuento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_descuento
    ADD CONSTRAINT tipo_descuento_pkey PRIMARY KEY (id);


--
-- Name: usuario usuario_cedula_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_cedula_key UNIQUE (cedula);


--
-- Name: usuario usuario_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);


--
-- Name: acceso_pasajero acceso_pasajero_boleto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acceso_pasajero
    ADD CONSTRAINT acceso_pasajero_boleto_id_fkey FOREIGN KEY (boleto_id) REFERENCES public.boleto(id);


--
-- Name: acceso_pasajero acceso_pasajero_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acceso_pasajero
    ADD CONSTRAINT acceso_pasajero_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id);


--
-- Name: asiento asiento_bus_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asiento
    ADD CONSTRAINT asiento_bus_id_fkey FOREIGN KEY (bus_id) REFERENCES public.bus(id);


--
-- Name: asiento asiento_tipo_asiento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asiento
    ADD CONSTRAINT asiento_tipo_asiento_id_fkey FOREIGN KEY (tipo_asiento_id) REFERENCES public.tipo_asiento(id);


--
-- Name: boleto boleto_asiento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boleto
    ADD CONSTRAINT boleto_asiento_id_fkey FOREIGN KEY (asiento_id) REFERENCES public.asiento(id);


--
-- Name: boleto boleto_frecuencia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boleto
    ADD CONSTRAINT boleto_frecuencia_id_fkey FOREIGN KEY (frecuencia_id) REFERENCES public.frecuencia(id);


--
-- Name: boleto boleto_metodo_pago_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boleto
    ADD CONSTRAINT boleto_metodo_pago_id_fkey FOREIGN KEY (metodo_pago_id) REFERENCES public.metodo_pago(id);


--
-- Name: boleto boleto_tipo_descuento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boleto
    ADD CONSTRAINT boleto_tipo_descuento_id_fkey FOREIGN KEY (tipo_descuento_id) REFERENCES public.tipo_descuento(id);


--
-- Name: boleto boleto_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boleto
    ADD CONSTRAINT boleto_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id);


--
-- Name: bus bus_cooperativa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bus
    ADD CONSTRAINT bus_cooperativa_id_fkey FOREIGN KEY (cooperativa_id) REFERENCES public.cooperativa(id);


--
-- Name: frecuencia frecuencia_ciudad_destino_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.frecuencia
    ADD CONSTRAINT frecuencia_ciudad_destino_id_fkey FOREIGN KEY (ciudad_destino_id) REFERENCES public.ciudad(id);


--
-- Name: frecuencia frecuencia_ciudad_origen_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.frecuencia
    ADD CONSTRAINT frecuencia_ciudad_origen_id_fkey FOREIGN KEY (ciudad_origen_id) REFERENCES public.ciudad(id);


--
-- Name: frecuencia frecuencia_cooperativa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.frecuencia
    ADD CONSTRAINT frecuencia_cooperativa_id_fkey FOREIGN KEY (cooperativa_id) REFERENCES public.cooperativa(id);


--
-- Name: hoja_ruta hoja_ruta_bus_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hoja_ruta
    ADD CONSTRAINT hoja_ruta_bus_id_fkey FOREIGN KEY (bus_id) REFERENCES public.bus(id);


--
-- Name: hoja_ruta hoja_ruta_cooperativa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hoja_ruta
    ADD CONSTRAINT hoja_ruta_cooperativa_id_fkey FOREIGN KEY (cooperativa_id) REFERENCES public.cooperativa(id);


--
-- Name: hoja_ruta hoja_ruta_frecuencia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hoja_ruta
    ADD CONSTRAINT hoja_ruta_frecuencia_id_fkey FOREIGN KEY (frecuencia_id) REFERENCES public.frecuencia(id);


--
-- Name: notificacion notificacion_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacion
    ADD CONSTRAINT notificacion_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id);


--
-- Name: parada_frecuencia parada_frecuencia_ciudad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parada_frecuencia
    ADD CONSTRAINT parada_frecuencia_ciudad_id_fkey FOREIGN KEY (ciudad_id) REFERENCES public.ciudad(id);


--
-- Name: parada_frecuencia parada_frecuencia_frecuencia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parada_frecuencia
    ADD CONSTRAINT parada_frecuencia_frecuencia_id_fkey FOREIGN KEY (frecuencia_id) REFERENCES public.frecuencia(id);


--
-- Name: ruta ruta_bus_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ruta
    ADD CONSTRAINT ruta_bus_id_fkey FOREIGN KEY (bus_id) REFERENCES public.bus(id);


--
-- Name: ruta ruta_frecuencia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ruta
    ADD CONSTRAINT ruta_frecuencia_id_fkey FOREIGN KEY (frecuencia_id) REFERENCES public.frecuencia(id);


--
-- Name: usuario usuario_cooperativa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_cooperativa_id_fkey FOREIGN KEY (cooperativa_id) REFERENCES public.cooperativa(id) ON DELETE SET NULL;


--
-- Name: usuario usuario_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.rol(id) ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict gsXkSFYjoi0RMR67Z47eyplZCT9koCN8HPagtTfJFG2agPh344kcomgxEcRULTI

