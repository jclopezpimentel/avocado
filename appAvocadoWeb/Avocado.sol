pragma solidity ^0.5.9;

contract Avocado{
    address root;
    address[] admors;

    constructor() public{
        root = msg.sender;
    }

    function addAdmor(address k) public{
        require(msg.sender == root);
        admors.push(k);
    }
    
/*    function addUser(address k, string memory T) public{
        require(admor.exists(msg.sender));
        user.put(k,T);
    }
    
    function setData(address k, string memory D) public returns(uint) {
        require(user.exists(msg.sender));
        require(user.permits(k);
        I=data.put(k,D);
        return I;
    }
    
    function getData(address k, string memory I) view public returns(string memory){
        require(data.find(I,k) and data.permits(I,k));
        D = data.get(I,k);
        return D;
    }
*/
}

