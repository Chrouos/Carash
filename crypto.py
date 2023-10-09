from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad
import base64

def encrypt(message: str, key: str) -> str:
    # Ensure key is 32 bytes (256 bits) long
    key = key.encode()[:32].ljust(32, b'\0')
    
    # Generate a random 16 bytes IV
    iv = get_random_bytes(16)
    
    cipher = AES.new(key, AES.MODE_CBC, iv)
    encrypted_message = cipher.encrypt(pad(message.encode(), AES.block_size))
    
    # Combine IV and encrypted message, then encode to base64
    return base64.b64encode(iv + encrypted_message).decode('utf-8')

def decrypt(encrypted_message: str, key: str) -> str:
    # Ensure key is 32 bytes (256 bits) long
    key = key.encode()[:32].ljust(32, b'\0')
    
    # Decode the base64 encoded message
    decoded_message = base64.b64decode(encrypted_message)
    
    # Extract IV and encrypted message
    iv = decoded_message[:16]
    encrypted_message = decoded_message[16:]
    
    cipher = AES.new(key, AES.MODE_CBC, iv)
    decrypted_message = unpad(cipher.decrypt(encrypted_message), AES.block_size)
    
    return decrypted_message.decode('utf-8')

def main():
    message = input("Enter the message to encrypt: ")
    key = input("Enter the encryption key (at least 32 characters for AES-256): ")
    
    encrypted = encrypt(message, key)
    print("\nEncrypted Message (to be placed in config):")
    print(f"ENC({encrypted})")
    print(f"Validation value is {decrypt(encrypted, key)}")

if __name__ == "__main__":
    main()
