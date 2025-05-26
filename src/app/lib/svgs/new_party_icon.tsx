import "@styles/svgs/gear.scss"

const NewPartyIcon: React.FC<{ width?: number; height?: number }> = ({ width = 200, height = 200 }) => {
    return (
        <svg className="new_party-icon" height={height} width={width} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 297 297">
        <g>
        	<g>
        		<g>
        			<g>
        				<circle className="circle" cx="148.5" cy="148.5" r="148.5"/>
        			</g>
        		</g>
        	</g>
        	<path className="shadow" d="M245.337,127.5l-193.674,42l124.85,124.85c59.546-11.369,106.468-58.291,117.837-117.837
        		L245.337,127.5z"/>
        	<polygon className="plus" points="245.337,127.5 169.5,127.5 169.5,51.663 127.5,51.663 127.5,127.5 51.663,127.5 
        		51.663,169.5 127.5,169.5 127.5,245.337 169.5,245.337 169.5,169.5 245.337,169.5 	"/>
        </g>
        </svg>
    );
}

export default NewPartyIcon;