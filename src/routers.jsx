import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import PagePokers from "./page/PagePokers";
import PageSingle from "./page/PageSingle";

const Routers = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index path="single" element={<PageSingle />}/>
                    <Route path="pokers" element={<PagePokers />}/>
                </Route>
            </Routes>
        </HashRouter>
    )
}

export default Routers;