import "@styles/svgs/party_icon.scss"

const PartyIcon: React.FC<{ width?: number; height?: number }> = ({ width = 200, height = 200 }) => {
    return (
        <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  {/* <!-- Red Circle Background --> */}
  <circle cx="100" cy="100" r="100" fill="red" />
  
  {/* <!-- Party Hat with Stripes --> */}
  <polygon points="80,140 120,140 100,60" fill="yellow" stroke="black" stroke-width="2" />
  <line x1="85" y1="130" x2="115" y2="70" stroke="black" stroke-width="2" />
  <line x1="90" y1="130" x2="110" y2="80" stroke="black" stroke-width="2" />
  <circle cx="100" cy="55" r="10" fill="blue" stroke="black" stroke-width="2" />
  
  {/* <!-- Confetti --> */}
  <circle cx="40" cy="40" r="5" fill="green" />
  <circle cx="160" cy="50" r="5" fill="purple" />
  <circle cx="70" cy="160" r="5" fill="orange" />
  <circle cx="130" cy="150" r="5" fill="pink" />
  <circle cx="50" cy="120" r="4" fill="blue" />
  <circle cx="150" cy="130" r="4" fill="yellow" />
  
  {/* <!-- Balloons with Strings --> */}
  <ellipse cx="50" cy="100" rx="15" ry="20" fill="blue" stroke="black" stroke-width="2" />
  <ellipse cx="150" cy="100" rx="15" ry="20" fill="yellow" stroke="black" stroke-width="2" />
  <line x1="50" y1="120" x2="50" y2="150" stroke="black" stroke-width="2" />
  <line x1="150" y1="120" x2="150" y2="150" stroke="black" stroke-width="2" />
</svg>
    );
};

export default PartyIcon;
