import './About.css';

export function About() {
    return (
        <div className="about-container">
            <div className="about-header">
                <h1>About Us</h1>
            </div>

            <div className="about-content">
                <div className="about-section">
                    <h2>Our Mission</h2>
                    <p>Welcome to BookShop, your premier destination for all things books. We believe that stories have the power to change lives, and we are dedicated to connecting readers with their next favorite adventure.</p>
                </div>

                <div className="about-section">
                    <h2>What We Do</h2>
                    <p>We are passionate about reading and bringing the best literature to your doorstep. From timeless classics to contemporary bestsellers, our curated collection is designed to inspire and delight readers of all ages.</p>
                </div>

                <div className="about-section">
                    <h2>Our Community</h2>
                    <p>BookShop is more than just a store; it's a community of book lovers. We host events, book clubs, and author signings to foster a love for reading and create a space where stories come alive.</p>
                </div>
            </div>
        </div>
    );
}
