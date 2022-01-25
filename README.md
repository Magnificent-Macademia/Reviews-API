# Reviews-API

This is an API to support Ecommerce client to peform CRUD operations on reviews data. In this project, we are using Express as our server linking to PostgreSQL using pooling.

[API Documentation](#api-documentation)

[Set up](#set-up)

## API Documentation
### GET /reviews/
  Query Parameters
  
  | Parameter  | Type | Description |
  | ------------- | ------------- | ------------- |
  | page | integer  | Selects the page of results to return. Default 1 |
  | count | integer  | Specifies how many results per page to return. Default 5 |
  | sort | text  | Changes the sort order of reviews to be based on "newest", "helpful", or "relevant" |
  | product_id | integer  | Specifies the product for which to retrieve reviews |


  Status: 200 OK
  ```
  {
    "product": "2",
    "page": 0,
    "count": 5,
    "results": [
      {
        "review_id": 5,
        "rating": 3,
        "summary": "I'm enjoying wearing these shades",
        "recommend": false,
        "response": null,
        "body": "Comfortable and practical.",
        "date": "2019-04-14T00:00:00.000Z",
        "reviewer_name": "shortandsweeet",
        "helpfulness": 5,
        "photos": [{
            "id": 1,
            "url": "urlplaceholder/review_5_photo_number_1.jpg"
          },
          {
            "id": 2,
            "url": "urlplaceholder/review_5_photo_number_2.jpg"
          },
          // ...
        ]
      },
      // ...
    ]
  }
  ```
### GET /reviews/meta
    Returns review metadata for a given product.
  
    Query Parameters
  
  | Parameter  | Type | Description |
  | ------------- | ------------- | ------------- |
  | product_id | integer  | Required ID of the product for which data should be returned |


  Status: 200 OK
  ```
  {
  "product_id": "2",
  "ratings": {
    2: 1,
    3: 1,
    // ...
  },
  "recommended": {
    0: 5
    // ...
  },
  "characteristics": {
    "Size": {
      "id": 14,
      "value": "4.0000"
    },
    // ...
  }
  ```
### POST /reviews
    Adds a review for the given product.
  
    Body Parameters
  
  | Parameter  | Type | Description |
  | ------------- | ------------- | ------------- |
  | product_id | integer  | Required ID of the product to post the review for |
  | rating | integer  | Integer (1-5) indicating the review rating |
  | summary | text  | Summary text of the review |
  | body | text  | Continued or full text of the review |
  | recommend | bool  | Value indicating if the reviewer recommends the product |
  | name | text  | Username for question asker |
  | email | text  | Email address for question asker |
  | photos | [text]  | Array of text urls that link to images to be shown |
  | characteristics | object | Object of keys representing characteristic_id and values representing the review value for that characteristic |


  Status: 201 CREATED

 ### PUT /reviews/:review_id/helpful
    Updates a review to show it was found helpful.
  
    Parameters
  
  | Parameter  | Type | Description |
  | ------------- | ------------- | ------------- |
  | review_id | integer  | Required ID of the review to update |


  Status: 204 NO CONTENT
  
  
### PUT /reviews/:review_id/report
    Updates a review to show it was reported. 
    Parameters
  
  | Parameter  | Type | Description |
  | ------------- | ------------- | ------------- |
  | review_id | integer  | Required ID of the review to update |


  Status: 204 NO CONTENT


## Set up
### For local:
1. Clone the repo, ```npm install``` to get all dependencies
2. Use the Schema in psql.sql to create a your PostgreSQL table. 
3. Create environmental variables to instruct PostgreSQL to link to your created database
    PGPORT=5432
    PGPASSWORD=yourpassword
    PGUSER=youruser
    PGDATABASE=yourdb
    PGHOST=localhost
4. ```npm start``` 

### For testing the server:
1. Create a testing database and edit the __test__ to connect to the database
2. run ```npm test```

For local stress testing:
1. Download k6 with bres ```brew install k6```
2. Run k6 in your terminal ```k6 run script.js```

### For Deployment:
- Deploy on your virtual machine of choice. Example depoyment:
1. Deploy PostgreSQL on EC2 t2.micro Ubuntu Server 20.04 LTS (HVM) following this [tutorial](https://betterprogramming.pub/how-to-provision-a-cheap-postgresql-database-in-aws-ec2-9984ff3ddaea).
2. Use pg_dump to make a copy of you local database and copy that into your remote database [tutorial](https://www.postgresqltutorial.com/postgresql-copy-database/)
3. Deploy the server on EC2 t2.micro by first installing node [tutorial](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html) and then git clone the repo. Don't forget to reset the environmental variables for your postgres connection.
4. Make sure that all your inbound and outboud rules are allowing your servers to connect

### For monitoring and stress testing:
1. Set up New Relic [tutorial](https://docs.newrelic.com/docs/apm/agents/nodejs-agent/installation-configuration/install-nodejs-agent/)
2. Make sure you are using the correct key type [discussion](https://discuss.newrelic.com/t/node-new-relic-for-node-js-halted-startup-due-to-an-error-error-failed-to-connect-to-collector/138025)
3. Set up Loader.io following the official documentation

### For deploying ngninx as load balancer
1. Follow the ec2 ngninx documentation [tutorial](https://www.nginx.com/blog/setting-up-nginx/)
2. Edit your /etc/nginx/nginx.conf file to include your servers. ex. 
   ```user  nginx;
    worker_processes  auto;

    error_log  /var/log/nginx/error.log notice;

    events {
        worker_connections  1024;
    }


    http {

        upstream backend {
            server 54.82.183.155;
            server 3.92.178.104;
        }

        server {
            listen 80;


            location / {
                proxy_pass http://backend;
            }
        }
    }
    ```
3. Tune your nginx [tutorial](https://www.nginx.com/blog/tuning-nginx/)
