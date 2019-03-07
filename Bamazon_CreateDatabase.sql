drop database if exists bamazon;

create database bamazon;

use bamazon;

create table products (
	item_id integer auto_increment,
    product_name varchar(50) not null,
    department_name varchar(50) not null,
    price float default 0.00,
    stock_quantity integer default 0,
    primary key (item_id)
);

alter table products add column product_sales float;

create table departments (
	department_id integer auto_increment,
    department_name varchar(50) not null,
    overhead_costs float default 0.00,
    primary key (department_id)
);

insert into products (product_name, department_name, price, stock_quantity)
values
("Bike","Sporting Goods",125.00,20),
("Tent","Sporting Goods",85.00,35),
("Yoga mat","Sporting Goods",18.00,70),
("Hose","Garden",35.00,50),
("Shovel","Garden",25.00,100),
("Rake","Garden",29.00,100),
("Coffee Table","Home",95.00,30),
("Candle","Home",9.00,100),
("Tea pot","Home",15.00,50),
("Hammer","Hardware",12.00,100),
("Measuring tape","Hardware",8.00,100),
("Screw driver","Hardware",7.00,100),
("Shirt","Clothing",35.00,70),
("Pants","Clothing",49.00,100),
("Sweater","Clothing",45.00,75);

select * from products;



