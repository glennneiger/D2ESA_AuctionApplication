import xmlrpc.client
sock_db = xmlrpc.client.ServerProxy ('http://localhost:8069/xmlrpc/db')
all_base = sock_db.list()
print(all_base)

url = 'http://localhost:8069'
db = 'odoo'
username = 'harish.pakala@ovgu.de'
password = 'admin'

common = xmlrpc.client.ServerProxy('{}/xmlrpc/2/common'.format(url))
uid = common.authenticate(db, username, password, {})

models = xmlrpc.client.ServerProxy('{}/xmlrpc/2/object'.format(url))
ra = models.execute_kw(db, uid, password,
    'customeraddress.customeraddress', 'check_access_rights',
    ['read'], {'raise_exception': False})
print(ra)

rs = models.execute_kw(db, uid, password,
    'customeraddress.customeraddress', 'search_read',
    [[]],{'fields': ['zipcode', 'city', 'number','name']})

print(rs)
r2 = models.execute_kw(db, uid, password,
    'customeraddress.customeraddress', 'search_read',
    [[]],{'fields': ['zipcode', 'city', 'number']})

print(r2)
