import Image from '../models/Image';

export default {
    render(image: Image) {
        return {
            id: image.id,
            url: image.url,
            isAvatar: image.isAvatar 
        };
    },

    renderMany(images: Image[]) {
        return images.map(image => this.render(image))
    }
}