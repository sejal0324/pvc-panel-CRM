import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    Building2,
    User,
    Phone,
    MapPin,
    Package,
    DollarSign,
    TrendingUp,
    ShoppingCart,
    Calendar,
    Edit,
    Sparkles
} from "lucide-react";

import * as clientApi from "../apis/clientMApi";

import AiCard from "../components/AiCard";
import AiSpinner from "../components/AiSpinner";

import "./ClientDetails.css";

export default function ClientDetails() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [client,setClient]=useState(null);

    const [loading,setLoading]=useState(true);

    const [error,setError]=useState("");

    const [aiReady,setAiReady]=useState(false);

    const [analysisStep,setAnalysisStep]=useState(0);

    const [quantity,setQuantity]=useState(120);

    const pricePerPanel=250;

    const transport=1800;

    const margin=.22;

    const orderValue=quantity*pricePerPanel;

    const grossProfit=orderValue*margin;

    const netProfit=Math.round(grossProfit-transport);

    const recommendations=[

        {
            name:"PVC Adhesive",
            price:2500
        },

        {
            name:"Corner Profile",
            price:1800
        },

        {
            name:"Ceiling Panels",
            price:4200
        },

        {
            name:"UV Marble Sheets",
            price:6000
        }

    ];

    const upsell=recommendations.reduce(

        (sum,item)=>sum+item.price,

        0

    );

    useEffect(()=>{

        loadClient();

    },[]);

    async function loadClient(){

        try{

            const data=await clientApi.getClientById(id);

            setClient(data);

            let step=0;

            const timer=setInterval(()=>{

                step++;

                setAnalysisStep(step);

                if(step===4){

                    clearInterval(timer);

                    setAiReady(true);

                }

            },450);

        }

        catch(err){

            setError(err.message);

        }

        finally{

            setLoading(false);

        }

    }

    async function handleVisit(){

        const dueDate=prompt("Visit Date (YYYY-MM-DD)");

        if(!dueDate) return;

        await clientApi.scheduleVisit(id,dueDate);

        alert("Visit Scheduled");

    }

    async function handleFollowUp(){

        const dueDate=prompt("Follow-up Date (YYYY-MM-DD)");

        if(!dueDate) return;

        await clientApi.scheduleFollowUp(id,dueDate);

        alert("Follow-up Scheduled");

    }

    function getInitials(name){

        return name

            ?.split(" ")

            .map(word=>word[0])

            .join("")

            .substring(0,2)

            .toUpperCase();

    }

    if(loading){

        return <AiSpinner stepIndex={analysisStep}/>;

    }

    if(error){

        return(

            <div className="details-error-container">

                <h2>

                    {error}

                </h2>

            </div>

        );

    }};