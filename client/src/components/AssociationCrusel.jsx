import AssociationCard from "./AssociationCard";

const AssociationCarousel = ({ dataList, userId }) => {
    return (
        <div className="grid grid-cols-1 gap-5">
            {dataList.map((name, index) => (
                <div key={index} className="py-2 items-center justify-center cursor-pointer hover:scale-105 transition rounded bg-slate-200 hover:border-0 hover:border-[#322f2f]">
                    <AssociationCard association={name} userId={userId} />
                </div>
            ))}
        </div>
    );
};

export default AssociationCarousel;