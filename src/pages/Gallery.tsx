import { Container, Grid, Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

interface GalleryItem {
    title: string;
    link: string;
    description: string;
    image: string;
    external?: boolean;
}

function Gallery() {
    const items: GalleryItem[] = [
        {
            title: 'MAFS-1',
            link: '/mafs1',
            description: 'a D3 tool to visualize TV show predictions',
            image: '/assets/galleryThumbs/Mafs1.jpg',
        },
        {
            title: 'Map Art - Boston',
            link: '/map-art-bos',
            description: 'elevation tiles that look pretty nice together',
            image: '/assets/mapArt/BostonMapArt_1.jpg',
        },
        {
            title: 'Some Map Art - NJ',
            link: '/map-art-nj',
            description: 'a nice looking dataset from a remediation project',
            image: '/assets/galleryThumbs/NjMapArt.jpg',
        },
        {
            title: 'Map - Radiohead Style',
            link: '/map-art-radiohead',
            description: 'a map of US minnow species styalized like a Radiohead album cover',
            image: '/assets/galleryThumbs/htt_minnow.jpg',
        },
        {
            title: 'Random D3 sin wave',
            link: '/random-wave',
            description: "I made this when learning D3 animations. Sharing it because it's kinda nice",
            image: '/assets/galleryThumbs/randomSin.jpg',
        },
    ];

    return (
        <Container>
            <Box sx={{ padding: '20px' }}>
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    {items.map((item) => (
                        <Grid size={{ xs: 6, sm: 3, lg: 2 }} key={item.title}>
                            <Link to={item.link} style={{ textDecoration: 'none' }} target={item.external ? '_blank' : undefined}>
                                <Card
                                    variant='outlined'
                                    sx={{
                                        maxWidth: 300,
                                        backgroundColor: 'transparent',
                                        border: '1pt solid rgb(80,80,80)',
                                    }}                                >
                                    <CardMedia
                                        component="img"
                                        image={item.image}
                                        alt={item.title}
                                        sx={{
                                            width: 190,
                                            height: 130,
                                            margin: 'auto',
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <CardContent
                                        sx={{
                                            padding: '8px',
                                            fontSize: '0.75rem',
                                            textAlign: 'center',
                                            height: 100,
                                            overflowY: 'auto',
                                        }}
                                    >
                                        <Typography variant="body2"  >
                                            <u>{item.title}:</u> {item.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
}

export default Gallery;
