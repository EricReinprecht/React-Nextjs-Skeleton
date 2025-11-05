"use client";

import React from "react";
import { Party } from "@/src/app/lib/entities/party";
import { formatDateGerman } from "@/src/app/lib/utils/formatDate";
import { CategoryEntity } from "@/src/app/lib/entities/category";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SwiperArrowLeft from "@/src/app/lib/svgs/swiper_arrow_left";
import "@styles/pages/single-party.scss";
import PinnedMap from "@/src/app/lib/components/default/map";
import { Ticket, TicketClass } from "@prisma/client";

type Props = {
    tickets: Ticket[];
    setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
    ticketClasses: TicketClass[];
    setTicketClasses: React.Dispatch<React.SetStateAction<TicketClass[]>>;
};

const StepTickets: React.FC<Props> = ({ tickets = [], setTickets, ticketClasses = [], setTicketClasses }) => {
    return (
        <div className="party-wrapper preview">
            <div className="party-card">
                <div className="background"></div>
                <div className="party-content">
                    <div className="left-side">
                        
                    </div>
                    <div className="right-side">
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepTickets;
