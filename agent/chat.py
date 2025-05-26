from agents import Agent, Runner, set_default_openai_client, set_tracing_disabled, function_tool
from dotenv import load_dotenv
import httpx
import ssl
import asyncio
from openai import AsyncOpenAI
import os

load_dotenv()

# Create SSL context with verification disabled
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

# Create HTTP client with SSL verification disabled
http_client = httpx.AsyncClient(verify=False)

# Create custom OpenAI client with disabled SSL verification
custom_openai_client = AsyncOpenAI(
    api_key=os.getenv("OPEN_API_KEY"),
    http_client=http_client
)

# Set the custom client as the default for all agents
set_default_openai_client(custom_openai_client)

# Disable tracing to avoid SSL issues with tracing endpoint
set_tracing_disabled(True)

# Tools
@function_tool
async def get_cart_items()-> int:
    """ 
        Get the productId's of the items present in the cart 
        
        Output format:
            {
                "result": [1, 2, 3]
            }
    """
    print("Calling Get Cart Items")
    # make an api call to the cart endpoint
    response = await http_client.get(f"http://localhost:3001/api/cart/session_lxcylwz3l29")
    print("response", response)
    
    return response.json()

@function_tool
async def recommend_products(cart_item: str)-> int:
    """ 
        Based on the cart_item (only one id), recommend products to the user
        
        Output format:
            {
                "result": [1, 2, 3]
            }
    """
    print("Calling Recommend Products")
    # make an api call to the cart endpoint
    response = await http_client.get(f"http://localhost:3001/api/products/{cart_item}/recommendations")
    print("response", response)
    
    return response.json()

@function_tool
async def add_product_to_cart(product_name: str)-> int:
    """ 
        Add the product_id to the cart
        
        Product Added Successfully
    """
    print("Calling product name to get product id", product_name)
    
    response = await http_client.get(f"http://localhost:3001/api/products/name/{product_name}/id?exact=true")
    product_id = response.json()["productId"]
    
    print("Calling Add Product to Cart", product_id)
    
    
    response = await http_client.post(f"http://localhost:3001/api/cart/session_lxcylwz3l29/add", json={"productId": product_id, "quantity": 1})
    
    print("response", response)
    
    return response.json()

@function_tool
async def remove_product_from_cart(product_name: str)-> int:
    """ 
        Remove the product_id from the cart
        
        Product Removed Successfully
    """
    print("Calling product name to get product id", product_name)
    
    response = await http_client.get(f"http://localhost:3001/api/products/name/{product_name}/id?exact=true")
    product_id = response.json()["productId"]
    
    print("Calling Remove Product from Cart", product_id)
    
    
    response = await http_client.delete(f"http://localhost:3001/api/cart/session_lxcylwz3l29/remove/product/{product_id}")
    
    print("response", response)
    
    return response.json()

# Human in the loop
@function_tool
def get_connect_to_support_agent(text: str) -> str:
    """
    As user asks to connect to the support agent, connect to the support agent

    Args:
        text (str): The question ask by the user
    
    Returns:
        str: The support agent response.
    """
    print(f"\n📝 The user is asking to connect to the support agent:\n{text}\n")
    
    support_agent_response = input("Respond to the user: ")
    
    print(f"\n📝 The support agent response:\n{support_agent_response}\n")
    
    return support_agent_response


# Agents
get_cart_items = Agent(
    name="ECommerce Agent",
    instructions="""
        You are an ecommerce agent that can help with the following tasks:
        - Get all the items present in the cart -> return ONLY "productId" dont add any other TEXT
            JSON Output format:
            {
                "agent_response_text": "Here are list of products from Cart: ",
                "agent_response_productIds": ['1', '2']
            }
        
        - Based on the user input, recommend products to the user
            first get the productId's of the items present in the cart
            then based on the user input, recommend products to the user
            
            JSON Output format:
            {
                "agent_response_text": "Here are list of recommended products: ",
                "agent_response_productIds": ['1', '2']
            }
        
        - Add items to the cart
            Based on the name given by the user, get the product_id and add the product to the cart
            
            JSON Output format:
            {
                "agent_response_text": "Product Added Successfully",
            }
        
        - Remove items from the cart
            Based on the name given by the user, get the product_id and remove the product from the cart
            
            JSON Output format:
            {
                "agent_response_text": "Product Removed Successfully",
            }
        
        - If the user asks to connect to the support agent, connect to the support agent
            Wait for the support agent to respond to the user
            
            JSON Output format:
            {
                "agent_response_text": "Response from the support Team: {support_agent_response}",
            }
    """,
    model="gpt-4.1",
    tools=[get_cart_items, recommend_products, add_product_to_cart, remove_product_from_cart, get_connect_to_support_agent]
)

async def chat(user_input_data):
    print("user_input_data", user_input_data)
    response = await Runner.run(get_cart_items, user_input_data)
    print("response", response.final_output)
    
    return {"agent_response": response.final_output}
    