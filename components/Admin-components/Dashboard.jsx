'use client'

import CountCard from "./CountCard"
import ChartOne from "./Charts/ChartOne"
import ChartTwo from "./Charts/ChartTwo"
import ChartThree from "./Charts/ChartThree"
import Map from "./Maps/Map"
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi"
import { useCallback, useContext } from "react"
import { AdminDashboardContext } from "@/app/[locale]/admin-dashboard/page"
import { useState, useEffect } from "react"
import LoadingCircle from "../Client-components/Loading/LoadingCircle"
import { useTranslations } from "next-intl"
import axios from "axios"
import Image from "next/image"
import { IconContext } from "react-icons"
import { RiAdvertisementFill, RiGoogleFill, RiGoogleLine, RiMetaLine, RiTiktokFill, RiTiktokLine } from "react-icons/ri"
import { reach } from "yup"
import { FaArrowUp } from "react-icons/fa"

export default function Dashboard({ tenant_id }) {

    const t = useTranslations("admin-dashboard")
    const { sidebarHide, setSidebarHide, updateCard, setUpdateCard, changeTable, setChangeTable, userData, dataDashboard, tenantsCount } = useContext(AdminDashboardContext)
    const [campaigns, setCampaigns] = useState([])
    const [filter, setFilter] = useState("reach")

    const getCampaign = async() => {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/metric-by-tenant-id?tenantId=${localStorage.getItem('tenantId')}&status=${status}`, {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });
            setCampaigns(response.data.Data);
    }

    useEffect(() => {
        if(userData.roles == "admin"){
            getCampaign()
        }
    }, [])

    useEffect(() => {
        setFilterCampaign("reach")
    }, [])

    const setFilterCampaign = (filterset) => {
        let filteredCampaigns = []
        if(filterset === "reach"){
            filteredCampaigns = campaigns.sort((a, b) => parseInt(b.reach.replace(/\./g, "")) - parseInt(a.reach.replace(/\./g, "")));
        }else if (filterset === "amountspent"){
            filteredCampaigns = campaigns.sort((a, b) => parseInt(b.amountspent.slice(3).replace(/\./g, "")) - parseInt(a.amountspent.slice(3).replace(/\./g, "")));
        }else if(filterset === "impressions"){
            filteredCampaigns = campaigns.sort((a, b) => parseInt(b.impressions.replace(/\./g, "")) - parseInt(a.impressions.replace(/\./g, "")));
        }
        setCampaigns(filteredCampaigns);
    }
    
    const handlechangeFiilter = (value) => {
        // console.log(value)
        setFilter(value)
        setFilterCampaign(value)
    }

    // useEffect(() => {
    //     console.log(dataDashboard)
    // }, [dataDashboard])

    return (
        <>
            <div className="w-full h-full flex flex-wrap gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 w-full">
                    {userData.roles == "admin" ? <CountCard title={t('tenants')} value={userData.company_name ? userData.company_name : <div className="text-md animate-pulse">Loading...</div>} handleClick={"company"} /> :

                        userData.roles == "sadmin" ? <CountCard title={t('tenants')} value={tenantsCount ? tenantsCount : <div className="text-md animate-pulse">Loading...</div>} handleClick={"tenants"} /> :

                            <CountCard title={t('tenants')} value={<div className="text-md animate-pulse">Loading...</div>} />}

                    <CountCard title={t('users')} value={dataDashboard.users ? dataDashboard.users : <div className="text-md animate-pulse">Loading...</div>} handleClick={"users"} />

                    <CountCard title={t('campaigns')} value={dataDashboard.campaigns ? dataDashboard.campaigns : <div className="text-md animate-pulse">Loading...</div>} handleClick={"campaigns"} />
                    <CountCard title={t('clients')} value={dataDashboard.clients ? dataDashboard.clients : <div className="text-md animate-pulse">Loading...</div>} handleClick={"clients"} />
                </div>
                <div className="w-full flex flex-col lg:flex-row gap-7 mb-3">
                    <div className="w-full lg:w-1/3 h-[450px] bg-white dark:bg-slate-800 rounded-sm shadow-lg p-5">
                        <ChartOne />
                    </div>
                    <div className="w-full lg:w-2/3 h-[450px] bg-white dark:bg-slate-800 rounded-sm shadow-lg p-5">
                        <ChartTwo />
                    </div>
                </div>
                <div className="w-full flex flex-col lg:flex-row gap-7 mb-3">
                    <div className="w-full lg:w-3/5 h-[450px] bg-white dark:bg-slate-800 rounded-sm shadow-lg p-5">
                        <Map />
                    </div>
                    <div className="w-full lg:w-2/5 h-[450px] bg-white dark:bg-slate-800 rounded-sm shadow-lg p-5">
                        <ChartThree />
                    </div>
                </div>
                {
                    userData.roles == "admin" ? <div className="w-full h-fit flex flex-col gap-7 mb-3">
                    <div className="w-full h-fit bg-white dark:bg-slate-800 rounded-sm shadow-lg p-5 overflow-y-auto">
                        <div className="rounded-sm bg-white dark:bg-slate-800 shadow-default sm:px-7.5 xl:pb-1">
                            <div className="flex justify-between items-center mb-5">
                                <h4 className="mb-6 text-xl font-semibold text-black dark:text-slate-200">
                                    Top 5 Campaigns
                                </h4>
                                <div className="flex gap-2">
                                    <style>
                                        {
                                            `
                                            .filterselect{
                                                background-color: #3d50e0;
                                                color: white;
                                            }
                                            `
                                        }
                                    </style>
                                </div>
                            </div>

                            <div className="flex flex-col overflow-y-auto">
                                <div className="grid grid-cols-3 rounded-sm bg-slate-100 sm:grid-cols-5">
                                    <div className="p-2.5 xl:p-5">
                                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                                            {t('campaigns')}
                                        </h5>
                                    </div>
                                    <div className="p-2.5 text-center xl:p-5">
                                        <h5 className={`hover:cursor-pointer text-sm font-medium uppercase xsm:text-base ${filter == "amountspent" ? "text-blue-500" : ""}`} onClick={() => handlechangeFiilter("amountspent")}>
                                            {t('amount-spent')}
                                        </h5>
                                    </div>
                                    <div className="p-2.5 text-center xl:p-5">
                                    <h5 className={`hover:cursor-pointer text-sm font-medium uppercase xsm:text-base ${filter == "reach" ? "text-blue-500" : ""}`} onClick={() => handlechangeFiilter("reach")}>
                                            {t('reach')}
                                        </h5>
                                    </div>
                                    <div className="hidden p-2.5 text-center sm:block xl:p-5">
                                    <h5 className={`hover:cursor-pointer text-sm font-medium uppercase xsm:text-base ${filter == "impressions" ? "text-blue-500" : ""}`} onClick={() => handlechangeFiilter("impressions")}>
                                            {t('impressions')}
                                        </h5>
                                    </div>
                                    <div className="hidden p-2.5 text-center sm:block xl:p-5">
                                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                                            {t('start-date')}
                                        </h5>
                                    </div>
                                </div>

                                { campaigns && campaigns.map((data, index) => (
                                    <div key={index} className={`grid grid-cols-3 sm:grid-cols-5 border-b`}>
                                        <div className="flex items-center gap-3 p-2.5 xl:p-5">
                                            <div className="flex-shrink-0">
                                                <Image src={`/assets/${data.campaign_platform === 1 ? 'meta.svg' : data.campaign_platform === 2 ? 'google.svg' : 
                                                data.campaign_platform === 3 ? 'tiktok.svg' : '' 
                                                }`}  
                                                width={45}
                                                height={45}
                                                alt="Logo"/>
                                            </div>
                                            <p className="hidden text-black dark:text-slate-200 sm:block">
                                                {data.campaign_name}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                                            <p className="text-black dark:text-slate-200">{data.amountspent}</p>
                                        </div>

                                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                                            <p className="text-meta-3 dark:text-slate-200">{data.reach}</p>
                                        </div>
                                        <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                                            <p className="text-meta-5 dark:text-slate-200">{data.impressions}</p>
                                        </div>

                                        <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                                            <p className="text-black dark:text-slate-200">{data.start_date}</p>
                                        </div>

                                    </div>
                                )).slice(0,5)}
                            </div>
                        </div>
                    </div>
                </div>
                : ""
                }
                
            </div>
        </>
    )
}
