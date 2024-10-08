import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MyTable.css'; // Import the custom CSS file
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setNew, setI, setSave, setError } from './jsonSlice';

const MyTable2 = () => {
    const dispatch = useDispatch();
    
    let jsonObject = useSelector((state) => state.json.jsonObject);
    let I = useSelector((state) => state.json.I);
    let jsonArray = useSelector((state) => state.json.jsonArray);
    let Save = useSelector((state) => state.json.Save);
    const { error } = useSelector((state) => ({
       
        error:state.json.error
    }));
    
    useEffect(() => {
        // Ensure Save is set to false when the component mounts
        dispatch(setError(true))
        dispatch(setSave(false));
    }, [dispatch]);
    
    useEffect(() => {
        console.log(error)
        if (Save && !error) {
            Insert();
            alert("Data Saved");
            dispatch(setSave(false));
        }
    }, [Save,error]); 

    const Insert = async () => {
       
        let payload = {
            header_table: jsonObject,
            detail_table: jsonArray,
        };

        console.log(payload);

        try {
            const response = await axios.post("http://5.189.180.8:8010/header/multiple", payload);
            console.log("Success:", response.data); 
        } catch (error) {
            alert("An Error occurred");
            console.error("Error occurred while posting data:", error); 
        }
    };

    const handlePrint = () => {
        // Hide MyTable2
        const myTable2Element = document.getElementById('myTable2');
        if (myTable2Element) {
            myTable2Element.style.display = 'none';
        }
        alert("Print Landscape");
        // Trigger print
        window.print();
        // Show MyTable2 after printing
        if (myTable2Element) {
            myTable2Element.style.display = 'block';
        }
    };

    return (
        <div className="container mt-4" style={{ width: "130px", top: "0px", right: "69px", position: "relative" }}>
            <table style={{ marginTop: "0px", borderColor: "black" }} className="table table-bordered">
                <tbody>
                    {Array.from({ length: 30 }, (_, rowIndex) => {
                        let content;

                        if (rowIndex === 5) {
                            content = <td style={{ background: "yellow", height: "30px", cursor: 'pointer' }} onClick={() => { window.location.reload(); console.log("clicked") }}>New</td>;
                        } else if (rowIndex === 6) {
                            content = <td style={{ background: "yellow", height: "20px", cursor: 'pointer' }} onClick={() => { console.log("Inserted", I); dispatch(setI(true)); }}>Insert</td>;
                        } else if (rowIndex === 7) {
                            content = <td style={{ background: "yellow", height: "20px", cursor: 'pointer' }} onClick={() => { dispatch(setSave(true)); }}>Save</td>;
                        } else if (rowIndex === 8) {
                            content = <td style={{ background: "yellow", height: "20px", cursor: 'pointer' }} onClick={() => { handlePrint(); }}>Print</td>;
                        } else {
                            content = <td></td>; // Default empty cell
                        }

                        return (
                            <tr key={rowIndex}>
                                {content}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default MyTable2;
