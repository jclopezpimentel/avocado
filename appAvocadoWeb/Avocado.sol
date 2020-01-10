pragma solidity ^0.5.9;

contract Avocado{
    address root;
    mapping (address=> address) admors;

    constructor() public{
        root = msg.sender;
    }

    function addAdmor(address k) public{
        require(msg.sender == root);
        admors[k] = k;
    }
    
    mapping (address=> address) readers;
    function addReader(address k) public{
        require(admors[msg.sender] == msg.sender);
        readers[k] = k;
    }

    mapping (address=> address) writers;
    function addWriter(address k) public{
        require(admors[msg.sender] == msg.sender);
        writers[k] = k;
    }

    string[] data;
    function setData(string memory d)  public returns(uint) {
        require(writers[msg.sender] == msg.sender);
        data.push(d);
        return (data.length-1);
    }

    function getData(uint id) view public returns(string memory){
        require(readers[msg.sender] == msg.sender);
        string memory D;
        if((id>=0) && id<data.length){
            D = data[id];
        }else{
            D="";
        }
        return D;
    }
}

