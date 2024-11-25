import './header.css';
import Logo from '../../img/servicenow-header-logo.svg';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import apiBaseUrl from "../../configs/apiBaseUrl";

function Header(props) {

    const [showCustomer, setShowCustomer] = useState(false);
    const [options, setOptions] = useState([]);

    // required for dropdown
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    // end for requirement for dropdown

  // Fetch data from the API
  useEffect(() => {
    const fetchOptions = async () => {
      try {
         const response = await axios.get(`${apiBaseUrl.prod}/company`);
        
        setOptions(response.data.companies); // Extracting the companies array
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);


    
      const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setDropdownOpen(true);
      };
    
      const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      );
      


    const handleNewCustomerClick = () => {
        props.changeHeaderName("New-Customer");
        // alert("New Customer button clicked");
        // Add more logic here if needed
      };

      const handleExistingCustomerClick = () => {
        setDropdownOpen(!isDropdownOpen);
      };
    
        const handleExistingCustomerHeader = () => {
            if(selectedOption === ""){
                return
            }
            props.setSetCompany(selectedOption)
            // alert(`Selected: ${selectedOption}`)
            setDropdownOpen(false);
            setShowCustomer(true);

            props.changeHeaderName("Existing-Customer");
        }


 

  return (
    <div className="Header">
        <div className='header-container' style={{ position: 'relative' }}>
                <div>
                    <a href="https://www.servicenow.com/">
                        <img src={Logo} className="companyLogo" alt="company Logo" />
                    </a>
                </div>
                <div className="header-text-wrapper">
                    <div className="header-text">
                        <button className="text-1" onClick={handleNewCustomerClick}>New Customers</button>
                        <button className="text-2" 
                          onClick={handleExistingCustomerClick}
                         onMouseEnter={() => setDropdownOpen(true)}
                         >
                        {props.newCustomer
                                ? 'Existing Customers'
                                : (<span className='selected-customer-old'>{selectedOption}</span>)}
                        </button>
                    </div>
                </div>

                {isDropdownOpen && (
                    <div 
                    className="dropdown-menu"
                    //onMouseLeave={() => setDropdownOpen(false)} // Close dropdown on mouse leave
                    >
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search Existing Company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select className="customer-select"  onChange={(e) => handleOptionSelect(e.target.value)} defaultValue="">
                        <option value="" disabled>Select a customer</option>
                        {filteredOptions.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                        ))}
                    </select>
                    <button className="submit-button" onClick={handleExistingCustomerHeader}>Submit</button>
                    </div>
                )}
               
        </div>
    </div>
  );
}

export default Header;
