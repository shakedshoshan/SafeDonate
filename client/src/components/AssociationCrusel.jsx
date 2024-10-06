import AssociationCard from "./AssociationCard";
// import { cleanText } from "../utils/textUtil";

const AssociationCrusel = ({ dataList, userId }) => {
    return (
        <div className="grid grid-cols-3 gap-10 max-w-7xl ">
            {dataList.map((name, index) => (
                <div key={index} className="px-4 py-6 p-24 items-center max-h-max justify-center cursor-pointer transition rounded-2xl bg-slate-50 hover:bg-slate-200 shadow-md hover:shadow-2xl hover:scale-105">
                    <AssociationCard association={name} userId={userId} />
                    {/* <AssociationCard association={cleanText(association)} userId={userId} /> */}
                </div>
            ))}
        </div>  
    );
};

export default AssociationCrusel;