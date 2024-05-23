import React from "react";
import { Link } from "react-router-dom";

const EditUsers = () => {
    return (
    <div className="edit">
        <h3 style={{fontSize: '50px', textAlign: 'center',}}>Редаутировать  Пользователей</h3>
        <div style={{display: 'flex', gap:'5vw'}}>
            <ul className="what-can-be-changed-row" >
                <h5 className="settings-name">Удалить</h5>
                <li className="what-can-be-changed-options" style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                    <Link to={`/admin/delete/user`}>Удалить (почта || логин)</Link>         
                </li>
            </ul>
            <ul className="what-can-be-changed-row">
                <h5 className="settings-name">Поменять</h5>
                <li className="what-can-be-changed-options" style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                    <Link to={`/admin/change/user-stuf`}>Информацию</Link>                         
                </li>
            </ul>
        </div>
    </div>
    )
}
export default EditUsers