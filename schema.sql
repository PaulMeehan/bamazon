drop database if exists bamazon;

create database bamazon;

use bamazon;

create table products (
	item_id integer auto_increment,
    product_name varchar(50) not null,
    department_name varchar(50) not null,
    price float default 0.00,
    stock_quantity integer default 0,
	product_sales float default 0.0,
    primary key (item_id)
);

create table departments (
	department_id integer auto_increment,
    department_name varchar(50) not null,
    overhead_costs float default 0.00,
    primary key (department_id)
);



