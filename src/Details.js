import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MyTable.css';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setI, setJsonArray, setTotal } from './jsonSlice';

const MyTable1 = () => {
    const dispatch = useDispatch();
    const vrNo = parseInt(useSelector((state) => state.json.jsonObject.vr_no));
    const Save = useSelector((state) => state.json.Save);
    const Insert = useSelector((state) => state.json.Insert);
    const I = useSelector((state) => state.json.I);
    const {total } = useSelector((state) => ({
       
        total:state.json.total
    }));

    const [inputValues, setInputValues] = useState([{vr_no: vrNo, sr_no: '', item_code: '', item_name: '', qty: '', rate: '', amount: '' }]);
    const [displayCount, setDisplayCount] = useState(0);

    const fetchDetailData = async () => {
        try {
            const response = await axios.get('http://5.189.180.8:8010/detail');
            const filtered = response.data.filter(item => item.vr_no === vrNo);
            setDisplayCount(filtered.length);
            setInputValues([...filtered]);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (vrNo) {
            fetchDetailData();
        }
    }, [vrNo]);

    useEffect(() => {
        if (Save) {
            setInputValues(prev => {
                const newInputValues = [...prev];
                newInputValues.pop(); // Remove the last empty row
                return newInputValues;
            });
            setDisplayCount(inputValues.length);
        }
    }, [Save]);

    const handleInputChange = (index, field, value) => {
        
        setInputValues(prevInputValues => {
            const updatedInputs = prevInputValues.map((item, idx) => {
                if (idx === index) {
                    const quantity = parseFloat(value) || (field === 'qty' ? 0 : parseFloat(item.qty));
                    const rate = field === 'rate' ? parseFloat(value) : parseFloat(item.rate);
                    return {
                        ...item,
                        [field]: value,
                        amount: (quantity * rate).toFixed(2),
                    };
                }
                return item;
            });

            // Add a new row if it's the last one
            if (index === prevInputValues.length - 1 && Insert === true) {
                updatedInputs.push({ vr_no: vrNo, sr_no: '', item_code: '', item_name: '', qty: '', rate: '', amount: '' });
            }

            return updatedInputs;
        });
    };
    
    useEffect(()=>{
        console.log(total)
        dispatch(setTotal(0))
       
    },[dispatch])
    const total1 = ()=>{
        let total=inputValues.reduce((acc, item) => acc + (parseFloat(parseInt(item.rate) * parseInt(item.qty)) || 0), 0);
        console.log(parseInt(total))
        return total
    }
    useEffect(()=>{
        dispatch(setTotal(inputValues.reduce((acc, item) => acc + (parseFloat(parseInt(item.rate) * parseInt(item.qty)) || 0), 0)))
    },[inputValues])
  
    const handleSubmit = () => {
        dispatch(setJsonArray(inputValues)); 
    };

    useEffect(() => {
        console.log(I)
        if (I) {
            console.log("hey")
            setInputValues(prev => [...prev, { vr_no: vrNo, sr_no: '', item_code: '', item_name: '', qty: '', rate: '', amount: '' }]);
        }
    }, [I==true]);

    useEffect(() => {
       
        if (I) {
            dispatch(setI(false));
        }
    }, []);

    useEffect(() => {
        handleSubmit();
    }, [inputValues]);

    const renderInputField = (value, onChange, disabled,width,type) => (
        <input
            style={{border:"none",width:width}}
            type= {type}
            value={value}
            onChange={onChange}
            disabled={disabled}
        />
    );

    useEffect(() => {
        // Update sr_no when inputValues changes
        const updatedInputs = inputValues.map((item, index) => ({
            ...item,
            sr_no: index + 1
        }));
        setInputValues(updatedInputs);
    }, [inputValues.length]);

    return (
        <div className="container mt-4">
            <div style={{ display: "inline-flex", justifyContent: "center", alignItems: "center", height: "40px", width: "100%", background:"blanchedalmond", marginBottom: "0px" }}>
                Detail
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", height: "40px", width: "100%", color: "white", background: "#330", marginBottom: "0px" }}>
                <div style={{width:"40%"}}>Sr No</div>
                <div style={{width:"60%"}}>Item Code</div>
                <div style={{width:"70%"}}>Item Name</div>
                <div style={{width:"40%"}}>Qty</div>
                <div style={{width:"40%"}}>Rate</div>
                <div style={{width:"40%"}}>Amount</div>
            </div>
            <table id="Table" style={{ width:"100%" }} className="custom-table">
                <tbody>
                  
                    {!isNaN(vrNo) && (inputValues.length>0 && !isNaN(inputValues[0].vr_no)||I==true) && inputValues.map((item, index) => (
                        <tr key={index}>
                            <td style={{width:"30px"}}>{index + 1}</td> {/* Sr No */}
                            <td>{renderInputField(item.item_code, e => handleInputChange(index, 'item_code', e.target.value), index < displayCount || Save,"50%","text")}</td>
                            <td>{renderInputField(item.item_name, e => handleInputChange(index, 'item_name', e.target.value), index < displayCount || Save,"70%","text")}</td>
                            <td>{renderInputField(item.qty, e => handleInputChange(index, 'qty', e.target.value), index < displayCount || Save,"80%","number")}</td>
                            <td>{renderInputField(item.rate, e => handleInputChange(index, 'rate', e.target.value), index < displayCount || Save,"50%","number")}</td>
                            <td>
                                <input
                                    style={{width:"50%"}}
                                    type="text"
                                    value={item.rate * item.qty}
                                    readOnly
                                    className="form-control"
                                    disabled={index < displayCount || Save}
                                />
                            </td> {/* Amount */}
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={5} style={{textAlign:"80%",paddingRight:"100px"}}>Total-</td>
                        <td>{total1()}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default MyTable1;
