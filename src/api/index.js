import { request } from "./base";
import { Client, Supplier, Product, Combo, Entry, Exit, Inventory, License } from "./services";

request.client = Client;
request.supplier = Supplier;
request.product = Product;
request.combo = Combo;
request.entry = Entry;
request.exit = Exit;
request.inventory = Inventory;
request.license = License;

export default request;