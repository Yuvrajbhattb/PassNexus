// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title PassNexusRegistry
 * @dev Manages user registration and friend connections for PassNexus
 */
contract PassNexusRegistry {
    // Mapping from wallet address to public encryption key
    mapping(address => string) private userPublicKeys;
    
    // Mapping from user address to their list of friends
    mapping(address => address[]) private userFriends;
    
    // Mapping to check if a user is registered
    mapping(address => bool) private isRegistered;
    
    // Email registry mappings
    mapping(string => address) public emailToAddress;
    mapping(address => string) public addressToEmail;
    
    // Events
    event UserRegistered(address indexed user, string publicKey);
    event FriendAdded(address indexed user, address indexed friend);
    event EmailRegistered(address indexed user, string email);
    
    /**
     * @dev Register a user with their public encryption key
     * @param publicKey The user's public encryption key for secure communication
     */
    function registerUser(string memory publicKey) public {
        require(bytes(publicKey).length > 0, "Public key cannot be empty");
        require(!isRegistered[msg.sender], "User already registered");
        
        userPublicKeys[msg.sender] = publicKey;
        isRegistered[msg.sender] = true;
        
        emit UserRegistered(msg.sender, publicKey);
    }
    
    /**
     * @dev Add a friend to the caller's friend list
     * @param friendAddress The wallet address of the friend to add
     */
    function addFriend(address friendAddress) public {
        require(isRegistered[msg.sender], "You must be registered first");
        require(isRegistered[friendAddress], "Friend must be registered");
        require(friendAddress != msg.sender, "Cannot add yourself as a friend");
        require(!isFriend(msg.sender, friendAddress), "Already friends");
        
        userFriends[msg.sender].push(friendAddress);
        
        emit FriendAdded(msg.sender, friendAddress);
    }
    
    /**
     * @dev Get the list of friends for the caller
     * @return Array of friend addresses
     */
    function getFriends() public view returns (address[] memory) {
        return userFriends[msg.sender];
    }
    
    /**
     * @dev Get the public key of a registered user
     * @param userAddress The address of the user
     * @return The user's public encryption key
     */
    function getPublicKey(address userAddress) public view returns (string memory) {
        require(isRegistered[userAddress], "User not registered");
        return userPublicKeys[userAddress];
    }
    
    /**
     * @dev Check if a user is registered
     * @param userAddress The address to check
     * @return True if the user is registered, false otherwise
     */
    function isUserRegistered(address userAddress) public view returns (bool) {
        return isRegistered[userAddress];
    }
    
    /**
     * @dev Check if two users are friends
     * @param user The first user address
     * @param friend The potential friend address
     * @return True if they are friends, false otherwise
     */
    function isFriend(address user, address friend) public view returns (bool) {
        address[] memory friends = userFriends[user];
        for (uint i = 0; i < friends.length; i++) {
            if (friends[i] == friend) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * @dev Get the number of friends a user has
     * @param userAddress The address of the user
     * @return The number of friends
     */
    function getFriendCount(address userAddress) public view returns (uint) {
        return userFriends[userAddress].length;
    }
    
    /**
     * @dev Register an email address for the caller
     * @param _email The email address to register
     */
    function registerEmail(string memory _email) public {
        require(bytes(_email).length > 0, "Email cannot be empty");
        require(bytes(addressToEmail[msg.sender]).length == 0, "Email already registered for this address");
        require(emailToAddress[_email] == address(0), "Email already registered to another address");
        
        emailToAddress[_email] = msg.sender;
        addressToEmail[msg.sender] = _email;
        
        emit EmailRegistered(msg.sender, _email);
    }
    
    /**
     * @dev Get wallet address by email
     * @param _email The email to lookup
     * @return The associated wallet address
     */
    function getAddressByEmail(string memory _email) public view returns (address) {
        return emailToAddress[_email];
    }
    
    /**
     * @dev Get email by wallet address
     * @param _addr The wallet address to lookup
     * @return The associated email address
     */
    function getEmailByAddress(address _addr) public view returns (string memory) {
        return addressToEmail[_addr];
    }
    
    /**
     * @dev Check if an email is registered
     * @param _email The email to check
     * @return True if registered, false otherwise
     */
    function isEmailRegistered(string memory _email) public view returns (bool) {
        return emailToAddress[_email] != address(0);
    }
}
