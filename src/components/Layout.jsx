import { ConnectWallet } from "@thirdweb-dev/react";
import { NavLink, Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div>
            <div style={{ textAlign: "center" }}><h1>簡易發牌比大小 with ZK-proof </h1></div>
            <div style={{ textAlign: "center", fontSize: "28px", marginBottom: "8px" }}>
                <NavLink to={"/single"} style={{ paddingLeft: "16px", paddingRight: "16px" }}> single </NavLink>
                <NavLink to={"/pokers"} style={{ paddingLeft: "16px", paddingRight: "16px" }}> pokers </NavLink>
            </div>
            <div style={{display: "flex", justifyContent: "center", marginTop: "8px", marginBottom: "8px"}}>
                <div> <ConnectWallet/> </div>
            </div>
            <div>
                <Outlet/>
            </div>
        </div>
    )
}

export default Layout;