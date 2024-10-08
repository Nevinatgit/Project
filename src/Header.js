import React, { useEffect, useState } from 'react';
import './MyTable.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { setJsonObject, setSave,setError, setTotal } from './jsonSlice';
import axios from 'axios';

const MyTable = () => {
    const dispatch = useDispatch();
    const { vr_no, Save,total } = useSelector((state) => ({
        vr_no: state.json.jsonObject.vr_no,
        Save: state.json.Save,
        total:state.json.total
    }));

    useEffect(()=>{
        console.log(total)
        setTotal(0)
       
    },[dispatch])
    useEffect(()=>{
        console.log(total)
    },[total])
    const [displayHead, setDisplayHead] = useState(false);
    const [inputValues, setInputValues] = useState({
        vr_no: '',
        ac_name: '',
        vr_date: '',
        status: '',
        ac_amt: '',
    });

    useEffect(() => {
        const fetchDetailData = async (vr_no) => {
            try {
                const response = await axios.get('http://5.189.180.8:8010/header');
                const filtered = response.data.filter(item => item.vr_no === parseInt(vr_no));
                
                if (filtered.length > 0) {
                    alert("Record already exists")
                    setDisplayHead(true);
                    setInputValues(filtered[0]);
                } else {
                    setDisplayHead(false);
                    setInputValues({
                        vr_no: vr_no,
                        ac_name: "",
                        ac_date: "",
                        status: "",
                        ac_amt: "",
                    

                    });
                }
            } catch (error) {
                console.error(error);
            }
        };

        const timeoutId = setTimeout(() => {
            if (inputValues.vr_no) fetchDetailData(inputValues.vr_no);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [inputValues.vr_no]);
    useEffect(()=>{
        let message;
        let error;
        if(!inputValues.status && Save==true){
            
           message+=" status,"
            error=true
        }
        if(!inputValues.ac_amt && Save==true){
           
           message+="Account Amount,"
           error=true
        }
        if(!inputValues.ac_name && Save==true){
 
           message+="Account Name,"
           error=true
        }
        if(!inputValues.vr_date && Save==true){
 
            message+="Account date,"
            error=true
         }
         if(error){
            alert("Enter the "+message)
            
            dispatch(setSave(false))
         }else{
            dispatch(setError(false))
         }
    },[Save===true])
    useEffect(()=>{
        console.log(inputValues)
    },[inputValues])
    const formatDate = (date) => {
        if (!date) return ''; // Handle null or undefined input
    
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(d.getDate()).padStart(2, '0');
    
        return `${year}-${month}-${day}`;
    };
    const handleInputChange = (field, value) => {
        let error;
        let message="";
        if(field==='status'){
            console.log(value)
            if(value!=""&&(value!='A'&& value !='I')){
            error=true
            message+="Status must be A or I"
            alert(message)
            }
        }
        if(field==='ac_amt')
        {   
            if (!(!isNaN(parseFloat(value)) && isFinite(parseFloat(value)))) {
                error=true
                message+="Enter Number for  Amount"
                 alert(message)
            }
        }
        if ( field === 'vr_date') {
            value = formatDate(value); // Use the formatDate function
           
        } 
        if(!error){
            setInputValues((prev) => ({ ...prev, [field]: value }));
        }
    };

    const handleSubmit = () => {
        dispatch(setJsonObject(inputValues));
    };

    useEffect(() => {
        handleSubmit();
    }, [inputValues]);

    const renderInputField = (type, field, value, disabled) => 
    {if(field!='status'){
     return   (
        <input
            className="input-field"
            type={type}
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            disabled={disabled}
            style={{
                width: '100%',
                height: '100%',
                margin: '0',
                border: 'none',
                borderRadius: '0px',
            }}
        />
     )
    }else{
        return(
        <select
        className="input-field"
        value={value}
        onChange={(e) => handleInputChange(field, e.target.value)}
        disabled={disabled}
        style={{
            width: '50px',
            height: '100%',
            margin: '0',
            border: 'none',
            borderRadius: '0px',
        }}
    >
        <option value="" disabled>Select</option>
        <option value="A">A</option>
        <option value="I">I</option>
    </select>
        )

    }
    
};

    return (
        <div className="container mt-4">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px', background: 'yellow', marginBottom: '0px' }}>
                Header
            </div>
            <table  style={{ width: '100%' }}>
                <tbody>
                    {Array.from({ length: 5 }, (_, rowIndex) => {
                        const columnCount = rowIndex === 3 ? 11 : 13;
                        return (
                            <tr key={rowIndex}>
                                {Array.from({ length: columnCount }, (_, colIndex) => {
                                    let content = null;

                                    // Column definitions
                                    const columnDef = {
                                        2: {
                                            4: <td style={{ border: '1px solid black',width:"50px",height:"15px" }}>Vr No</td>,
                                            5: (
                                                <td  style={{ border: '1px solid black',width:"50px",height:"15px"}}>
                                                    {renderInputField('number', 'vr_no', inputValues.vr_no, Save)}
                                                </td>
                                            ),
                                            6: <td style={{ border: '1px solid black',width:"50px",height:"15px" }}>Vr Date</td>,
                                            7: (
                                                <td style={{ border: '1px solid black',width:"50px",height:"15px"}}>
                                                    {renderInputField('date', 'vr_date', formatDate(new Date()), Save || displayHead)}
                                                </td>
                                            ),
                                            8: <td style={{ border: '1px solid black',width:"50px",height:"15px" }}>Status</td>,
                                            9: (
                                                <td style={{ border: '1px solid black',width:"50px",height:"15px"}}>
                                                    {renderInputField('text', 'status', inputValues.status, Save || displayHead)}
                                                </td>
                                            ),
                                        },
                                        3: {
                                            4: <td style={{border: '1px solid black', width:"50px",height:"20px" }}>ac Name</td>,
                                            5: (
                                                <td colSpan={3} style={{ border: '1px solid black',width:"50px",height:"15px"}}>
                                                    {renderInputField('text', 'ac_name', inputValues.ac_name, Save || displayHead)}
                                                </td>
                                            ),
                                            6: <td style={{border: '1px solid black', width:"50px",height:"20px"}}>Amount</td>,
                                            7: (
                                                <td style={{ border: '1px solid black',width:"50px",height:"15px"}}>
                                                    {renderInputField('text', 'ac_amt', total, Save || displayHead)}
                                                </td>
                                            ),
                                        },
                                    };

                                    content = columnDef[rowIndex]?.[colIndex] || <td style={{ border: '1px solid black',height:"30px",width:"50px" }}></td>;

                                    return content;
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default MyTable;
