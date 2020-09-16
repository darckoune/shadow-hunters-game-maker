#!/bin/bash
#convert
for image in uncompressed_cards_images/*.png; do
        dst="${image%.png}.webp"
        dst="public/cards/images/${dst##*/}"
        convert  "$image"  "$dst"
        echo “image $image converted to ${dst}”
done

for image in uncompressed_cards_images/*.png; do
        dst="${image%.png}.jpg"
        dst="public/cards/images/${dst##*/}"
        convert  "$image"  "$dst"
        echo “image $image converted to ${dst}”
done
exit 0 