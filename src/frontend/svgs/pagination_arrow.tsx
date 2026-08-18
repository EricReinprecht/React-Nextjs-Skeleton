import "@styles/svgs/pagination_arrow.scss"

const PaginationArrow: React.FC<{ width?: number; height?: number; color?: string; hoverColor?: string; orientation?: "right" | "left" | "up" | "down" }> = ({ width = 40, height = 40, color = "black", hoverColor = "white", orientation = "right" }) => {
    const rotation = {
        right: "-90",
        left: "90",
        up: "0",
        down: "180",
    }[orientation]

    const adjustment = {
        right: "-1px",
        left: "+1px",
        up: "0",
        down: "0",
    }[orientation]

    return (
        <svg className="pagination-arrow" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" height={height} width={width} style={{transform: `rotate(${rotation}deg)`, left: adjustment}} viewBox="0 0 240.835 240.835" >
            <g>
	            <path fill="currentColor" d="M129.007,57.819c-4.68-4.68-12.499-4.68-17.191,0L3.555,165.803c-4.74,4.74-4.74,12.427,0,17.155 c4.74,4.74,12.439,4.74,17.179,0l99.683-99.406l99.671,99.418c4.752,4.74,12.439,4.74,17.191,0c4.74-4.74,4.74-12.427,0-17.155 L129.007,57.819z"/>
	        <g>
	        </g>
	        <g>
	        </g>
	        <g>
	        </g>
	        <g>
	        </g>
	        <g>
	        </g>
	        <g>
	        </g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
         </g>
    </svg>
    );
};

export default PaginationArrow;
