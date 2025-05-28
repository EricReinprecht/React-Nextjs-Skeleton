import "@styles/svgs/edit_accept.scss"

const EditAccept: React.FC<{ width?: number; height?: number; color?: string }> = ({ width = 24, height = 24, color = "black" }) => {
    return (
        <svg className="edit_accept-icon" fill={color} width={width} height={height} viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg">
            <polygon points="14 21.414 9 16.413 10.413 15 14 18.586 21.585 11 23 12.415 14 21.414"/>
            <path d="M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm0,26A12,12,0,1,1,28,16,12,12,0,0,1,16,28Z"/>
            <rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" className="cls-1" width="16" height="16"/>
        </svg>
    );
};

export default EditAccept;