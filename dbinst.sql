create table videos
(
	ID serial not null,
	path varchar not null,
	launch_time varchar not null
);

create unique index videos_ID_uindex
	on videos (ID);

create unique index videos_launch_time_uindex
	on videos (launch_time);

alter table videos
	add constraint videos_pk
		primary key (ID);

create table stats
(
	ID serial not null,
	username varchar not null,
	date varchar not null,
	status varchar
);

create unique index stats_ID_uindex
	on stats (ID);

alter table stats
	add constraint stats_pk
		primary key (ID);

