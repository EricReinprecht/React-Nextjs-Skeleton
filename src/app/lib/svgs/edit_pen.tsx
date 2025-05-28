import "@styles/svgs/edit_pen.scss"

const EditPen: React.FC<{ width?: number; height?: number; color?: string }> = ({ width = 24, height = 24, color = "black" }) => {
    return (
        <svg className="edit_pen-icon" width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 20H20.5M18 10L21 7L17 3L14 6M18 10L8 20H4V16L14 6M18 10L14 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
};

export default EditPen;