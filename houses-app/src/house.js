import React, { Component } from 'react'
import './house.css'

class House extends Component {
    constructor() {
        super()
        this.state = { houses: [] }
    }
    componentDidMount() {
        fetch('/list')
            .then(res => res.json())
            .then(houses =>
                this.setState({ houses }, () => console.log('houses fetshed', houses))
            )
    }
    render() {
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Country</th>
                            <th>City</th>
                            <th>Address</th>
                            <th>Size</th>
                            <th>Price</th>
                            <th>Price per m2</th>
                            <th>Rooms</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.houses.map((houses, i) => (
                            <tr key={i}>
                                <td>{houses.title}</td>
                                <td>{houses.location_country}</td>
                                <td>{houses.location_city}</td>
                                <td>{houses.location_address}</td>
                                <td>{houses.size_grossm2}</td>
                                <td>{houses.price_value}</td>
                                <td>{houses.price_value / houses.size_grossm2}</td>
                                <td>{houses.size_rooms}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
}
export default House