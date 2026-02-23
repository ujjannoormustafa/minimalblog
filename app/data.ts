export interface Post {
    id: string;
    title: string;
    description: string;
    content: string;
    image: string;
    category: string;
    date: string;
    readTime: string;
    author: string;
    authorAvatar: string;
    featured?: boolean;
}

export const CATEGORIES = ['All', 'Technology', 'Lifestyle', 'Travel', 'Design'];

export const POSTS: Post[] = [
    {
        id: '1',
        title: 'The Future of AI: What the Next Decade Holds',
        description: 'Exploring how artificial intelligence is reshaping industries, creative work, and the very fabric of society.',
        content: `Artificial Intelligence has come a long way. From simple chatbots to complex decision-making systems, AI is transforming every industry in ways we could barely imagine a decade ago.

In healthcare, AI models are diagnosing diseases with accuracy surpassing human doctors. In finance, algorithms are managing trillions in assets. In creative fields, generative models are producing art, music, and prose that challenge our notions of creativity itself.

But what comes next? The next decade promises even more dramatic shifts. We're moving from narrow AI — systems that excel at one specific task — toward more general systems capable of reasoning across domains.

Perhaps most fascinating is the emergence of AI as a collaborative partner. Rather than replacing human creativity, the best AI tools amplify it. A designer who once spent hours on mockups can now iterate in minutes. A developer can describe functionality in plain language and watch it materialize.

The ethical dimensions are equally important. As these systems grow more powerful, questions of bias, accountability, and access become critical. The future of AI isn't just a technical challenge — it's a deeply human one.

What remains certain is that those who learn to work alongside AI will have a significant advantage. The skill is not in understanding the algorithms, but in asking the right questions, crafting the right prompts, and critically evaluating AI output.

The future is arriving faster than any of us anticipated. The time to prepare is now.`,
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
        category: 'Technology',
        date: 'Feb 15, 2026',
        readTime: '6 min read',
        author: 'Alex Morgan',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
        featured: true,
    },
    {
        id: '2',
        title: 'Minimalist Living: The Art of Owning Less',
        description: 'How embracing minimalism can bring clarity, focus, and surprising joy to your everyday life.',
        content: `Minimalism is not just about owning fewer things. It is about making intentional space — physically, mentally, and emotionally — for what truly matters.

The modern world constantly pushes us to acquire more: more gadgets, more clothes, more subscriptions, more commitments. Yet study after study shows that beyond a certain threshold, more possessions don't increase happiness. They often reduce it.

When you declutter your physical space, something remarkable happens. Your mind follows. The mental overhead of managing, maintaining, and thinking about possessions simply evaporates. What remains is clarity.

Minimalism is also deeply personal. For some, it means owning under 100 possessions. For others, it's simply being intentional about what enters their life. There's no rulebook — only the principle of choosing quality over quantity.

Practically, start small. Pick one drawer, one closet, one category. Ask of each item: does this serve a genuine purpose in my life right now? If not, let it go.

The unexpected side effect of minimalism is gratitude. When you own fewer things, you appreciate what you have far more. That morning coffee becomes a ritual. That well-worn jacket becomes a trusted companion.

In a world of infinite options, choosing less might be the most radical act of all.`,
        image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1200',
        category: 'Lifestyle',
        date: 'Feb 18, 2026',
        readTime: '5 min read',
        author: 'Sarah Chen',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    },
    {
        id: '3',
        title: 'Hidden Gems of Europe You Need to Visit',
        description: 'Beyond the tourist trail: discover the most breathtaking and underrated destinations across Europe.',
        content: `Europe is a continent famous for its landmarks. The Eiffel Tower. The Colosseum. The Sagrada Familia. Millions flock to these icons every year — and for good reason. But Europe's real magic often hides in plain sight.

Kotor, Montenegro: A walled medieval city tucked between dramatic mountains and a shimmering bay. Fewer crowds than Dubrovnik, but equal in beauty and far more authentic in spirit.

Ghent, Belgium: Often overlooked in favor of Bruges, Ghent is a living, breathing city with spectacular architecture, world-class art, and a culinary scene that rivals anywhere in Europe.

The Faroe Islands: Between Norway and Iceland lies an archipelago of surreal beauty. Waterfalls that fall into the sea. Villages perched on cliffs. Skies that feel like they belong to another world.

Matera, Italy: Carved into a ravine in southern Italy, Matera is one of the oldest continuously inhabited cities on Earth. Its cave dwellings — called Sassi — glow golden at sunset.

Sintra, Portugal: Just 30 minutes from Lisbon, Sintra feels like a fairy tale. Colorful palaces emerge from misty forest hillsides. The air smells of eucalyptus and history.

The best travel isn't about checking off famous sights. It's about the unexpected moments — the hidden café, the narrow alley, the view that takes your breath away. Europe has more of these than anywhere else on Earth.`,
        image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=1200',
        category: 'Travel',
        date: 'Feb 20, 2026',
        readTime: '7 min read',
        author: 'Marco Ricci',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
    },
    {
        id: '4',
        title: 'Modern Design Principles Every Creator Should Know',
        description: 'The core principles behind clean, effective, and emotionally resonant user interface design.',
        content: `Design is not decoration. Design is communication. Every visual decision — color, spacing, typography, hierarchy — sends a message. The best designers understand this deeply.

Whitespace is not empty space. It is breathing room. It directs attention, creates rhythm, and gives your design room to speak. Novice designers fear whitespace and try to fill it. Expert designers cherish it.

Typography is the voice of your design. The typeface you choose sets tone before a single word is read. Serif fonts convey tradition and trust. Sans-serif fonts feel modern and approachable. The weight, size, and spacing all contribute to how information is perceived.

Color psychology is real and powerful. Blues calm. Reds energize. Yellows invite optimism. But context matters enormously — a red that signals danger in one context might signal passion in another. Use color intentionally, not decoratively.

Visual hierarchy is about guiding the eye. What should the user see first? Second? What can wait? Every element on a screen should have a clear purpose in the hierarchy.

Consistency builds trust. When UI elements behave predictably, users feel confident. When they surprise, users feel anxious. Establish a visual language and maintain it ruthlessly.

Finally, design for real humans, not hypothetical ones. Test your designs. Watch people use them. The humbling experience of watching someone struggle with something you thought was obvious is the fastest path to becoming a better designer.`,
        image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1200',
        category: 'Design',
        date: 'Feb 21, 2026',
        readTime: '5 min read',
        author: 'Priya Sharma',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
    },
    {
        id: '5',
        title: 'Building Habits That Actually Stick',
        description: 'The science and practical strategies behind forming lasting habits that transform your daily life.',
        content: `We all know the feeling. January 1st resolution, strong discipline for two weeks, then slowly back to square one. Why do most habits fail — and what separates those that stick?

The science is clear: habits don't form through willpower alone. They form through systems, environment design, and repetition. Understanding this changes everything.

The habit loop, popularized by researcher Charles Duhigg, has three components: cue, routine, reward. Every habit you have, good or bad, follows this pattern. To build a new habit, attach it to an existing cue.

This is called habit stacking. After I pour my morning coffee (cue), I will sit and meditate for five minutes (new habit). The existing routine becomes a trigger for the new behavior.

Environment design is equally powerful. Put the book on your pillow if you want to read before bed. Put the running shoes by the front door. Reduce the friction for good behaviors and increase it for bad ones.

Start embarrassingly small. Most people fail because they set goals that are too ambitious. Want to exercise daily? Commit to one push-up. The goal is to never miss, to build the identity of someone who works out — not to have a perfect workout.

Consistency matters infinitely more than intensity. The person who exercises for 20 minutes every day will outperform the person who does marathon sessions once a week, every time.

Build habits that align with who you want to become, not just what you want to achieve.`,
        image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=1200',
        category: 'Lifestyle',
        date: 'Feb 19, 2026',
        readTime: '6 min read',
        author: 'Sarah Chen',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    },
    {
        id: '6',
        title: 'The Rise of Remote Work Culture',
        description: 'How distributed teams are redefining productivity, collaboration, and the meaning of the workplace.',
        content: `The pandemic didn't create remote work — it accelerated a shift that was already underway. Now, millions of people work from homes, cafes, co-working spaces, and even different countries. What does this mean for how we work?

The productivity debate has largely been settled. Study after study shows remote workers are often more productive than their office counterparts. No commutes, fewer interruptions, more autonomy. For deep work, distributed environments often win.

But culture is harder. The casual conversations that spark innovation, the mentorship that happens in hallways, the sense of belonging that comes from shared physical space — these are genuinely lost in remote environments.

The best distributed companies are intentional about this. They invest in async communication, documentation, and regular in-person gatherings. They over-communicate deliberately. They build rituals that create connection across time zones.

The rise of remote work has also democratized opportunity. Talented people in smaller cities or different countries can now access jobs that were once geographically restricted. This is genuinely transformative.

For individuals, the key to thriving remotely is structure. Create boundaries between work and life. Design dedicated workspaces. Build in social connection intentionally.

The workplace of the future will be hybrid — combining the flexibility of remote with the connection of in-person. Organizations that figure this out will attract the best talent. Those that don't will struggle to compete.`,
        image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=1200',
        category: 'Technology',
        date: 'Feb 17, 2026',
        readTime: '5 min read',
        author: 'Alex Morgan',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    },
];
