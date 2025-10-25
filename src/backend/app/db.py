from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DB = os.getenv("MONGODB_DB", "dnd_dev")

client = MongoClient(MONGODB_URI)
db = client[MONGODB_DB]

# print(f"Connected to MongoDB database: {MONGODB_DB}")

# mycol = db["maps"]









# # Creating a Collection

# # To create a collection in MongoDB, use database object and specify the name of the collection you want to create.

# # MongoDB will create the collection if it does not exist.
# # Example
# # Get your own Python Server

# # Create a collection called "customers":
# # import pymongo

# # myclient = pymongo.MongoClient("mongodb://localhost:27017/")
# # mydb = myclient["mydatabase"]

# # mycol = mydb["customers"]


# # Or you can check a specific collection by name:
# # Example

# # Check if the "customers" collection exists:
# # collist = mydb.list_collection_names()
# # if "customers" in collist:
# #   print("The collection exists.")


# collist = db.list_collection_names()
# if "maps" in collist:
#   print("The collection exists.")



# mydict = { "name": "John", "address": "Highway 37" }

# x = mycol.insert_one(mydict)

# print(db.list_collection_names())


# mylist = [
#   { "name": "Amy", "address": "Apple st 652"},
#   { "name": "Hannah", "address": "Mountain 21"},
#   { "name": "Michael", "address": "Valley 345"},
#   { "name": "Sandy", "address": "Ocean blvd 2"},
#   { "name": "Betty", "address": "Green Grass 1"},
#   { "name": "Richard", "address": "Sky st 331"},
#   { "name": "Susan", "address": "One way 98"},
#   { "name": "Vicky", "address": "Yellow Garden 2"},
#   { "name": "Ben", "address": "Park Lane 38"},
#   { "name": "William", "address": "Central st 954"},
#   { "name": "Chuck", "address": "Main Road 989"},
#   { "name": "Viola", "address": "Sideway 1633"}
# ]

# x = mycol.insert_many(mylist)

# #print list of the _id values of the inserted documents:
# #!!!!print(x.inserted_ids) 


# # No parameters in the find() method gives you the same result as SELECT * in MySQL.

# for x in mycol.find():
#   print(x)

# # Return Only Some Fields

# # The second parameter of the find() method is an object describing which fields to include in the result.

# # This parameter is optional, and if omitted, all fields will be included in the result.
# # Example

# # Return only the names and addresses, not the _ids:


# for x in mycol.find({},{ "_id": 0, "name": 1, "address": 1 }):
#   print(x) 

#   #!!You are not allowed to specify both 0 and 1 values in the same object (except if one of the fields is the _id field). If you specify a field with the value 0, all other fields get the value 1, and vice versa:

# import pymongo


# for x in mycol.find({},{ "address": 0 }):
#   print(x) 

# # You get an error if you specify both 0 and 1 values in the same object (except if one of the fields is the _id field):
# # import pymongo



# #?? for x in mycol.find({},{ "name": 1, "address": 0 }):
# #??   print(x) 


# #Find document(s) with the address "Park Lane 38":

# myquery = { "address": "Park Lane 38" }

# mydoc = mycol.find(myquery)

# for x in mydoc:
#   print(x) 



# #Advanced Query

# #Find documents where the address starts with the letter "S" or higher:

# myquery = { "address": { "$gt": "S" } }

# mydoc = mycol.find(myquery)

# for x in mydoc:
#   print(x) 



# # Filter With Regular Expressions

# # You can also use regular expressions as a modifier.

# # Regular expressions can only be used to query strings.

# # To find only the documents where the "address" field starts with the letter "S", use the regular expression {"$regex": "^S"}:
# # Example

# # Find documents where the address starts with the letter "S":


# myquery = { "address": { "$regex": "^S" } }

# mydoc = mycol.find(myquery)

# for x in mydoc:
#   print(x) 


# # Sort the Result

# # Use the sort() method to sort the result in ascending or descending order.

# # The sort() method takes one parameter for "fieldname" and one parameter for "direction" (ascending is the default direction).
# # Example
# # Get your own Python Server

# # Sort the result alphabetically by name:

# mydoc = mycol.find().sort("name")

# for x in mydoc:
#   print(x) 


# #Sort the result reverse alphabetically by name:

# mydoc = mycol.find().sort("name", -1)

# for x in mydoc:
#   print(x) 

# # Delete Document

# # To delete one document, we use the delete_one() method.

# # The first parameter of the delete_one() method is a query object defining which document to delete.

# # Note: If the query finds more than one document, only the first occurrence is deleted.
# # Example
# # Get your own Python Server

# # Delete the document with the address "Mountain 21":


# myquery = { "address": "Mountain 21" }

# mycol.delete_one(myquery) 


# # Delete Many Documents

# # To delete more than one document, use the delete_many() method.

# # The first parameter of the delete_many() method is a query object defining which documents to delete.
# # Example

# # Delete all documents were the address starts with the letter S:


# myquery = { "address": {"$regex": "^S"} }

# x = mycol.delete_many(myquery)

# print(x.deleted_count, " documents deleted.")

# # Delete All Documents in a Collection

# # To delete all documents in a collection, pass an empty query object to the delete_many() method:
# # Example

# # Delete all documents in the "customers" collection:


# #!!x = mycol.delete_many({})

# #!!print(x.deleted_count, " documents deleted.") 


# # Delete All Documents in a Collection

# # To delete all documents in a collection, pass an empty query object to the delete_many() method:
# # Example

# # Delete all documents in the "customers" collection:


# #!!x = mycol.delete_many({})

# #!!print(x.deleted_count, " documents deleted.") 


# # Delete Collection

# # You can delete a table, or collection as it is called in MongoDB, by using the drop() method.
# # Example
# # Get your own Python Server

# # Delete the "customers" collection:

# #mycol = db["customers"]

# #!!x = mycol.drop()

# #!!print(x)

# #Update Collection


# myquery = { "address": "Valley 345" }
# newvalues = { "$set": { "address": "Canyon 123" } }

# mycol.update_one(myquery, newvalues)

# #print "customers" after the update:
# for x in mycol.find():
#   print(x) 


# myquery = { "address": { "$regex": "^Y" } }
# newvalues = { "$set": { "name": "Minnie" } }

# x = mycol.update_many(myquery, newvalues)

# print(x.modified_count, "documents updated.") 

# for x in mycol.find():
#   print(x) 

# #limit the result

# print('aha')

# myresult = mycol.find().limit(5)

# #print the result:
# for x in myresult:
#   print(x) 
