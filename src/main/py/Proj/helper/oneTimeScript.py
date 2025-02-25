
import sys
from pathlib import Path
import os


sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))


import re
import base64
from app import create_app
from app.models.shoe import ShoeType
from app.services.shoe_service import ShoeService

def extract_shoe_info(text):
    """
    Extract shoe code and location from messages.
    
    Pattern looks for:
    - Shoe code in format like "FQ8714-001" or "DV0833-111" 
    - Location indicated by "מיקום" followed by a number
    - Also tries to identify image filenames in the messages
    """
    # Find all instances of shoe code followed by location
    pattern = r'IMG-\d{8}-WA\d{4}\.jpg.*?([A-Z]{2,}\d{4}-\d{3}).*?מיקום[\s\-\u05BE]*(\d+)'
    matches = re.findall(pattern, text, re.DOTALL)
    
    shoe_info = []
    for code, location in matches:
        code = code.strip()
        location = location.strip()
        try:
            location_int = int(location)
            shoe_info.append({
                'code': code,
                'loc': location_int,
                'image_pattern': f"IMG-\\d{{8}}-WA\\d{{4}}\\.jpg"  # Pattern to find the image filename
            })
        except ValueError:
            print(f"Could not parse location '{location}' for shoe code {code}")
    
    return shoe_info

def find_image_for_shoe(folder_path, shoe_code, image_pattern):
    """Find an image file in the folder that corresponds to a shoe code"""
    # First, get all image files in the folder
    image_files = [f for f in os.listdir(folder_path) if f.endswith('.jpg') or f.endswith('.jpeg') or f.endswith('.png')]
    
    # Look for image files that are mentioned close to the shoe code in the chat
    chat_file_path = os.path.join(folder_path, "chat.txt")
    try:
        with open(chat_file_path, 'r', encoding='utf-8') as file:
            content = file.read()
            
        # Find segments that contain both the shoe code and an image filename
        segments = re.split(r'\d{2}\.\d{2}\.\d{4}', content)  # Split by date patterns
        
        for segment in segments:
            if shoe_code in segment:
                # Find image references in this segment
                image_matches = re.findall(r'(IMG-\d{8}-WA\d{4}\.jpg)', segment)
                
                # Check if any of these images exist in the folder
                for img_ref in image_matches:
                    if img_ref in image_files:
                        return os.path.join(folder_path, img_ref)
    except Exception as e:
        print(f"Error searching for image reference in chat: {str(e)}")
    
    # If we couldn't find a match through chat references, return None
    return None

def process_folder(folder_path, shoe_type):
    """Process a folder containing WhatsApp chat and extract shoe information"""
    print(f"Processing {shoe_type.name} shoes folder at {folder_path}...")
    
    chat_file_path = os.path.join(folder_path, "chat.txt")
    if not os.path.exists(chat_file_path):
        print(f"Chat file not found at {chat_file_path}")
        return []
    
    try:
        with open(chat_file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        shoes = extract_shoe_info(content)
        
        # Add the shoe type to each shoe and look for images
        for shoe in shoes:
            shoe['type'] = shoe_type
            
            # Find image for this shoe
            image_path = find_image_for_shoe(folder_path, shoe['code'], shoe.get('image_pattern'))
            if image_path and os.path.exists(image_path):
                try:
                    with open(image_path, 'rb') as img_file:
                        image_data = img_file.read()
                        # Base64 encode the image data
                        shoe['image'] = base64.b64encode(image_data).decode('utf-8')
                        print(f"Found and loaded image for {shoe['code']}: {os.path.basename(image_path)}")
                except Exception as e:
                    print(f"Error loading image {image_path}: {str(e)}")
            else:
                print(f"No image found for shoe {shoe['code']}")
            
            # Remove the temporary image pattern field
            if 'image_pattern' in shoe:
                del shoe['image_pattern']
            
        return shoes
    except Exception as e:
        print(f"Error processing {chat_file_path}: {str(e)}")
        return []

def add_shoes_to_database(shoes):
    """Add extracted shoes to the database using ShoeService"""
    print(f"Adding {len(shoes)} shoes to database...")
    
    added = 0
    skipped = 0
    
    for shoe_data in shoes:
        # Convert shoe type from enum to string for API
        if 'type' in shoe_data and shoe_data['type']:
            shoe_data['type'] = shoe_data['type'].name
        
        result, status_code = ShoeService.add_shoe(shoe_data)
        
        if status_code == 201:
            added += 1
            print(f"Added shoe: {shoe_data['code']}, Location: {shoe_data['loc']}, Type: {shoe_data.get('type')}, Image: {'Yes' if 'image' in shoe_data else 'No'}")
        elif status_code == 409:
            skipped += 1
            print(f"Shoe already exists: {shoe_data['code']}")
        else:
            print(f"Failed to add shoe {shoe_data['code']}: {result.get('message')}")
    
    print(f"Finished processing: {added} shoes added, {skipped} shoes skipped")

def main():
    # Map folders to shoe types
    folder_mapping = {
        "Mans2": ShoeType.Man,
        "Woman2": ShoeType.Woman,
        "Children2": ShoeType.Children
    }
    
    base_path = r"C:\Users\yuval yael\Desktop\Nike"
    all_shoes = []
    
    # Process each folder
    for folder_name, shoe_type in folder_mapping.items():
        folder_path = os.path.join(base_path, folder_name)
        shoes = process_folder(folder_path, shoe_type)
        all_shoes.extend(shoes)
    
    print(f"Total shoes extracted: {len(all_shoes)}")
    
    # Create Flask app context to use the services
    app = create_app()
    with app.app_context():
        add_shoes_to_database(all_shoes)

if __name__ == "__main__":
    main()