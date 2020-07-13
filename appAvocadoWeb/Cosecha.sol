pragma solidity ^0.6.10;
// SPDX-License-Identifier: UNLICENSED

contract Cosecha{
    address root;
    uint id=0;
    struct SCosecha{
        uint id_cosecha;
        address whoAdded;
        uint256 fecha;
        uint latitud;
        uint longitud;
    }

    mapping (uint=> SCosecha) Mcosecha;
    //mapping (address=> bool) exists;

    //event CreateUser(address quienCrea, User userCreated);

    constructor() public{
        root = msg.sender;
    }


    function addCosecha(uint lat, uint long) public{
        //require(msg.sender == root);//we enforce the root to be the executor
        Mcosecha[id] = SCosecha(id,msg.sender,block.timestamp,lat,long);
        id++;
    }

    function getWhoAdded(uint i) view public returns (address){
        require(i<id);
        return (Mcosecha[i].whoAdded);
    }

    function getFecha(uint i) view public returns (uint){
        require(i<id);
        return (Mcosecha[i].fecha);
    }
    function getLatitud(uint i) view public returns (uint){
        require(i<id);
        return (Mcosecha[i].latitud);
    }
    function getLongitud(uint i) view public returns (uint){
        require(i<id);
        return (Mcosecha[i].longitud);
    }

}


