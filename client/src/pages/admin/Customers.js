import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');


    const fetchCustomers = () => {
        axios.get('http://localhost:3001/customers').then(response => {
            setCustomers(response.data);
        });
    };
    
    useEffect(() => {
        fetchCustomers();
    }, []);

    const deleteCustomer = (id) => {
        axios.get(`http://localhost:3001/customers/delete/${id}`).then(() => {
            fetchCustomers();
        });
    }

    const createCustomer = () => {
        let firstname = document.querySelector('input[placeholder="firstname"]').value;
        let lastname = document.querySelector('input[placeholder="lastname"]').value;
        let nickname = document.querySelector('input[placeholder="nickname"]').value;
        let year = document.querySelector('input[placeholder="year"]').value;
        let barman = document.querySelector('input[placeholder="barman"]').checked;
        let status = document.querySelector('input[placeholder="status"]').value;

        axios.post('http://localhost:3001/customers', {
            firstname: firstname,
            lastname: lastname,
            nickname: nickname,
            year: year,
            barman: barman,
            status: status
        }).then(() => {
            fetchCustomers();
        });
    }

    const normalizeString = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const filteredCustomers = customers.filter((customer) => {
        const search = normalizeString(searchTerm);
        return (
            normalizeString(customer.firstname).includes(search) ||
            normalizeString(customer.lastname).includes(search) ||
            normalizeString(customer.nickname).includes(search) ||
            normalizeString(customer.year.toString()).includes(search) ||
            normalizeString(customer.status).includes(search)
        );
    });

    return (
        <div>
            <h1>Customers</h1>

            <div>
                <input type="text" placeholder="firstname" />
                <input type="text" placeholder="lastname" />
                <input type="text" placeholder="nickname" />
                <input type="number" placeholder="year" />
                <input type="checkbox" placeholder="barman" />
                <input type="text" placeholder="status" />

                <button onClick={createCustomer}>Create</button>
            </div>

            <div>
                <input
                    type="text"
                    placeholder="Search by firstname, lastname, or nickname"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredCustomers.map((value, key) => { 
                return (
                    <div key={key}> 
                        <div>
                            { value.firstname } { value.lastname } { value.nickname } { value.year } { value.status }
                            <button onClick={() => deleteCustomer(value.id)}>Delete</button>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default Customers
