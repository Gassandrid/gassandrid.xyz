# AGE (CLI App)

## Overview

AGE is a simple, modern, and secure command-line tool for encrypting files. It was designed to be easy to use, ensuring that even those who are not experts in cryptography can securely encrypt their data. AGE stands out for its simplicity, speed, and the use of modern cryptographic techniques.

## Key Features

1. **Ease of Use:**
    
    - AGE is designed to be user-friendly, with a straightforward syntax for encrypting and decrypting files.
    - No need for managing complex key setups; keys are generated and used easily.
2. **Security:**
    
    - AGE uses modern cryptographic primitives to ensure the security of the encrypted data.
    - It avoids the pitfalls of legacy encryption tools by focusing on simplicity and avoiding unnecessary complexity.
3. **Interoperability:**
    
    - AGE supports multiple recipients, allowing files to be encrypted for multiple parties.
    - It is compatible with various file formats and systems.

## Installation

To install AGE, you can use package managers like `brew` on macOS, or download the binary directly from the AGE GitHub repository.

`# On macOS using Homebrew brew install age`

For other platforms, follow the instructions provided on the [AGE GitHub page](https://github.com/FiloSottile/age).

## Basic Usage

1. **Encrypting a File:**
    
    To encrypt a file using AGE:
    
    `age -o encrypted.txt.age -r RECIPIENT_PUBLIC_KEY file.txt`
    
    - `-o encrypted.txt.age` specifies the output file name.
    - `-r RECIPIENT_PUBLIC_KEY` is the public key of the recipient. You can use your own key if encrypting for yourself.
2. **Decrypting a File:**
    
    To decrypt a file:
    
    `age -d -i PRIVATE_KEY_FILE -o decrypted.txt encrypted.txt.age`
    
    - `-d` indicates decryption.
    - `-i PRIVATE_KEY_FILE` specifies the private key file.
    - `-o decrypted.txt` specifies the output file for the decrypted content.

## Key Management

1. **Generating a Key Pair:**
    
    To generate a new key pair:
    
    `age-keygen -o key.txt`
    
    This will create a key file containing both the private and public keys. The public key can be shared with others to allow them to encrypt files for you.
    
2. **Extracting the Public Key:**
    
    If you have a private key file and want to extract the public key:
    
    `age-keygen -y key.txt`
    
    This command outputs the public key associated with the private key.
    

## Encrypting for Multiple Recipients

AGE supports encrypting a file for multiple recipients, which can be useful when sharing sensitive data with a group.

`age -o encrypted.txt.age -r RECIPIENT_1_PUBLIC_KEY -r RECIPIENT_2_PUBLIC_KEY file.txt`

This command ensures that any of the specified recipients can decrypt the file with their private key.

## Password-Based Encryption

AGE also supports password-based encryption, allowing you to encrypt files without sharing a public key.

`age -p -o encrypted.txt.age file.txt`

The `-p` flag prompts for a password, which will be required to decrypt the file.

## Security Considerations

1. **Key Security:**
    
    - Keep your private key secure and never share it. If someone obtains your private key, they can decrypt files meant only for you.
2. **Password Strength:**
    
    - When using password-based encryption, ensure you choose a strong, unique password to prevent unauthorized access.
3. **Regular Updates:**
    
    - Stay updated with the latest version of AGE to benefit from any security patches or improvements.

## Integrations and Extensions

AGE can be integrated into scripts and automated workflows, making it a versatile tool for developers and system administrators who need to encrypt files on the fly. It also has plugins and extensions for integration with other tools, like Git.