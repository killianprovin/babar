import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';



function Customer() {
    let { id } = useParams();

    const [customer, setCustomer] = useState([]);

    useEffect(() => {
      axios.get(`http://localhost:3001/customers/byId/${id}`).then(response => {
        setCustomer(response.data);
    });
    }, []);
  
    return (
        <div className='list-block'>
            <div className='block'>
                <div className='Infos'>
                    <h1>Infos</h1>
                    <div className='info-card'>
                        <div className='info-item'>
                            <span className='info-label'><b>Nom : </b></span>
                            <span className='info-value'>{ customer.firstname }</span>
                        </div>
                        <div className='info-item'>
                            <span className='info-label'><b>Prénom : </b></span>
                            <span className='info-value'>{ customer.lastname }</span>
                        </div>
                        <div className='info-item'>
                            <span className='info-label'><b>Surnom : </b></span>
                            <span className='info-value'>{ customer.nickname }</span>
                        </div>
                        <div className='info-item'>
                            <span className='info-label'><b>Promo : </b></span>
                            <span className='info-value'>{ customer.year }</span>
                        </div>
                        <div className='info-item'>
                            <span className='info-label'><b>Status : </b></span>
                            <span className='info-value'>{ customer.status }</span>
                        </div>
                        <div className='info-item'>
                            <span className='info-label'><b>Montant investi : </b></span>
                            <span className='info-value'>{ customer.amount_invested }€</span>
                        </div>
                        <div className='info-item'>
                            <span className='info-label'><b>Découvert autorisé : </b></span>
                            <span className='info-value'>{ customer.allowed_overdraft }€</span>
                        </div>
                        <div className='info-item'>
                            <span className='info-label'><b>Solde : </b></span>
                            <span className='info-value'>{ customer.balance }€</span>
                        </div>
                    </div>
                </div>


                <div className='Deposits'>
                    <h1>Dépôts</h1>
                    <ul>
                        {customer.deposits && customer.deposits.map((deposit, key) => {
                            return (
                                <li className='deposit-item' key={key}>
                                    <span className='price'>{deposit.amount}€</span>
                                    <span className='date-deposit'>{new Date(deposit.createdAt).toLocaleString('fr-FR', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            <div className='block'>
                <div className='Purchases'>
                    <h1>Achats</h1>
                    <ul>
                        {customer.purchases && customer.purchases.map((purchase, key) => {
                            return (
                                <li className='purchase-item' key={key}>
                                    <span className='price'>{purchase.price}€ </span>
                                    <span className='details'>{purchase.quantity} {purchase.item}</span>
                                    <span className='date-purchase'>{new Date(purchase.createdAt).toLocaleString('fr-FR', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
  }

export default Customer