import AssociationCard from "./AssociationCard";
// import { cleanText } from "../utils/textUtil";

const AssociationCrusel = ({ dataList, userId }) => {
    return (
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {dataList.map((name, index) => (
                    <div 
                        key={index} 
                        className="flex h-[230px] w-full items-center justify-center p-4 cursor-pointer 
                                 transition-all duration-300 rounded-2xl bg-[#dedede] 
                                 hover:bg-slate-200 shadow-md hover:shadow-2xl hover:scale-105"
                    >
                        <div className="w-full h-full flex items-center justify-center">
                            <AssociationCard association={name} userId={userId} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssociationCrusel;
// import AssociationCard from "./AssociationCard";
// // import { cleanText } from "../utils/textUtil";

// const AssociationCrusel = ({ dataList, userId }) => {
//     return (
//         <div className="grid grid-cols-3 gap-10 max-w-7xl ">
//             {dataList.map((name, index) => (
//                 <div key={index} className="px-4 py-6 p-24 items-center max-h-max justify-center cursor-pointer transition rounded-2xl bg-slate-50 hover:bg-slate-200 shadow-md hover:shadow-2xl hover:scale-105">
//                     <AssociationCard association={name} userId={userId} />
//                     {/* <AssociationCard association={cleanText(association)} userId={userId} /> */}
//                 </div>
//             ))}
//         </div>  
//     );
// };

// export default AssociationCrusel;