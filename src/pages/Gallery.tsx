import { Container, Grid, Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

interface GalleryItem {
    title: string;
    link: string;
    description: string;
    image: string;
    external?: boolean;
}

const Separator = ({ children }: { children: string }) => (
    <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            my: 3,
            '&::before, &::after': {
                content: '""',
                flex: 1,
                borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
            },
            '&::before': {
                mr: 1,
            },
            '&::after': {
                ml: 1,
            },
        }}
    >
        <Typography variant="body2">{children}</Typography>
    </Box>
);

function Gallery() {
    const mainItems: GalleryItem[] = [
        {
            title: 'Carbon-14 Dating',
            link: '/carbon14',
            description: 'interactive radiocarbon dating with uncertainty visualization',
            image: '/assets/galleryThumbs/carbonFourteen.jpg',
        },
        {
            title: 'Covid Wastewater Plot',
            link: '/covid-wastewater',
            description: 'comparing two-axis plots with alternatives for COVID data',
            image: '/assets/galleryThumbs/twoAxisPlot.jpg',
        },
        {
            title: 'Random D3 sin wave',
            link: '/random-wave',
            description: "I made this when learning D3 animations. Sharing it because it's kinda nice",
            image: '/assets/galleryThumbs/randomSin.jpg',
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
            title: 'DyeLIF 3D Visualization',
            link: '/dyelif',
            description: '3D groundwater contamination modeling using Kriging interpolation',
            image: '/assets/galleryThumbs/dyeLif.jpg',
        },
        {
            title: 'Triangle Layer Model',
            link: '/triangle-layer',
            description: '3D groundwater flow model with triangular mesh and geologic layers',
            image: '/assets/galleryThumbs/triangleModflow.jpg',
        },
    ];

    const sillyItems: GalleryItem[] = [
        {
            title: 'MAFS-1',
            link: '/mafs1',
            description: 'a D3 tool to visualize TV show predictions',
            image: '/assets/galleryThumbs/Mafs1.jpg',
        },
        {
            title: 'MAFS-2',
            link: '/mafs2',
            description: 'another view of the TV show predictions with auto-scroll',
            image: '/assets/galleryThumbs/Mafs2.jpg',
        },
        {
            title: 'Bad Metronome',
            link: '/metronome',
            description: 'a metronome that intentionally does not keep good time',
            image: '/assets/galleryThumbs/badMetronome.jpg',
        },
        {
            title: 'Map - Radiohead Style',
            link: '/map-art-radiohead',
            description: 'a map of US minnow species styalized like a Radiohead album cover',
            image: '/assets/galleryThumbs/htt_minnow.jpg',
        },
    ];

    const renderItems = (items: GalleryItem[]) => (
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
                            }}
                        >
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
                                    textAlign: 'center',
                                    height: 100,
                                    overflowY: 'auto',
                                }}
                            >
                                <Typography variant="body2">
                                    <u>{item.title}:</u> {item.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Link>
                </Grid>
            ))}
        </Grid>
    );

    return (
        <Container>
            <Box sx={{ padding: '20px' }}>
                {renderItems(mainItems)}
                
                <Separator>Increasing Silliness:</Separator>
                {renderItems(sillyItems)}
            </Box>
        </Container>
    );
}

export default Gallery;
