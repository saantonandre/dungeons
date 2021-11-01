import { TextComponent, ImageComponent } from "../interfaceComponent.js";
/** Renders the processed details of the passed item */
export class ItemTooltip {
    constructor(x, y) {
        this.w = 6;
        this.h = 6;
        this.x = x - this.w;
        this.y = y;
        this.nameContent = new TextComponent(this.x + this.w / 2, this.y + 0.1);
        this.nameContent.align = 'center';
        this.nameContent.color = '#f5ffe8';
        this.nameContent.baseline = 'top';
        this.nameContent.fontSize = 9;

        let tilesize = 16;

        this.thumbnail = {
            x: this.x + this.w / 2 - 1, //center
            y: this.nameContent.y + this.nameContent.fontSize / tilesize,
            w: 2,
            h: 2
        }

        let descX = this.x + (this.w - this.w * 0.9) / 2;
        let descY = this.y + this.nameContent.fontSize / tilesize;
        this.descriptionContent = new TextComponent(descX, descY);
        this.descriptionContent.align = 'left';
        this.descriptionContent.color = '#f5ffe8bb';
        this.descriptionContent.fontSize = 6.5;
        this.descriptionContent.baseline = 'top';
        this.descriptionContent.w = this.w * 0.9;

        this.statsContent = new StatsContent(this.descriptionContent.x, this.descriptionContent.y + this.descriptionContent.h)
        this.statsContent.w = this.descriptionContent.w;

        this.sourceContent = new TextComponent(this.x + this.w - 0.1, this.y + this.h - 0.1);
        this.sourceContent.align = 'right';
        this.sourceContent.color = '#ffc2a1bb';
        this.sourceContent.fontSize = 6;
        this.sourceContent.baseline = 'top';


    }
    computeHeights(tilesize) {
        this.thumbnail.y = this.nameContent.y + this.nameContent.fontSize / tilesize;
        this.descriptionContent.y = this.thumbnail.y + this.thumbnail.h;
        this.descriptionContent.h = this.descriptionContent.content.length * (this.descriptionContent.fontSize / tilesize); // Amount of text rows

        this.statsContent.y = this.descriptionContent.y + this.descriptionContent.h + 0.1; // Amount of text rows
        this.statsContent.h = this.statsContent.statsAmount > 0 ? Math.ceil(this.statsContent.statsAmount / 2) : 0; // Amount of text rows

        this.sourceContent.y = this.statsContent.y + this.statsContent.h + 0.2;
        this.h = this.sourceContent.y + this.sourceContent.fontSize / tilesize - this.y;
    }
    render(context, tilesize, ratio, slotRef) {
        if (slotRef.isEmpty) {
            return;
        }
        let item = slotRef.item;
        this.nameContent.content = item.name;
        this.sourceContent.content = "source: " + item.sourceName.toUpperCase();
        this.rarityColorChange(item);
        // Breaks down the description to multiple lines 
        this.descriptionContent.content = getLines(
            context,
            item.description,
            this.descriptionContent.canvasFont(ratio),
            this.descriptionContent.w * tilesize * ratio
        )

        this.computeHeights(tilesize);

        // Rendering starts here
        this.renderBox(context, tilesize, ratio)
        this.nameContent.render(context, tilesize, ratio);
        this.drawLine(context, tilesize, ratio, this.nameContent.y + this.nameContent.fontSize / tilesize);
        this.descriptionContent.render(context, tilesize, ratio);
        this.statsContent.render(context, tilesize, ratio, item);
        this.sourceContent.render(context, tilesize, ratio);
        item.renderItem(this.thumbnail.x, this.thumbnail.y, context, tilesize, ratio, this.thumbnail.w, this.thumbnail.h);
    }
    /** Changes the nameContent color based on item rarity */
    rarityColorChange(item) {
        switch (item.rarity) {
            case "rare":
                this.nameContent.color = "#ffc2a1";
                break;
            case "common":
                this.nameContent.color = "#f5ffe8";

                break;
        }
    }
    /** Draws a line on the provided yPos based off the descriptionContent width/x pos */
    drawLine(context, tilesize, ratio, yPos) {
        context.globalAlpha = 1;
        context.strokeStyle = "#14182e";
        context.lineWidth = ratio;
        let x1 = this.descriptionContent.x;
        let x2 = this.descriptionContent.x + this.descriptionContent.w;
        context.beginPath();
        context.moveTo(x1 * tilesize * ratio, yPos * tilesize * ratio)
        context.lineTo(x2 * tilesize * ratio, yPos * tilesize * ratio)
        context.closePath();
        context.stroke()
        context.globalAlpha = 1;
    }
    renderBox(context, tilesize, ratio) {
        context.globalAlpha = 0.6;
        context.fillStyle = "#14182e";
        /** Sum of own components height */

        context.fillRect(
            (this.x) * tilesize * ratio,
            (this.y) * tilesize * ratio,
            (this.w) * tilesize * ratio,
            (this.h) * tilesize * ratio,
        )
        context.beginPath();
        context.strokeStyle = "#14182e";
        context.lineWidth = ratio;
        context.rect(
            (this.x) * tilesize * ratio,
            (this.y) * tilesize * ratio,
            (this.w) * tilesize * ratio,
            (this.h) * tilesize * ratio,
        )
        context.closePath();
        context.stroke()
        context.globalAlpha = 1;
    }
}

/**Analyzes and renders the stats
 * - Coun
 */
class StatsContent {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 0;
        this.h = 0;
        this.statIcon = new ImageComponent();
        this.statText = new TextComponent();
        this.statText.align = "left";
        this.statText.fontSize = 8;
        this.statSprites = {
            atk: [22, 21],
            atkSpeed: [22, 22],
            maxHp: [22, 23],
            maxMana: [22, 24]
        }
        this.statColors = {
            atk: '#ff8933',
            atkSpeed: '#f0b541',
            maxHp: '#ad2f45',
            maxMana: '#4fa4b8'
        }
        this.statsAmount = 0;
        // 22,21 --> 22,24

    }
    renderStat(context, tilesize, ratio, item, stat) {
        this.statIcon.spriteX = this.statSprites[stat][0];
        this.statIcon.spriteY = this.statSprites[stat][1];
        this.statIcon.x = this.x + this.w / 2 * ((this.statsAmount - 1) % 2);
        this.statIcon.y = this.y + ((this.statsAmount - 1) / 2 | 0);
        this.statIcon.render(context, tilesize, ratio)

        this.statText.x = this.x + this.statIcon.w + this.w / 2 * ((this.statsAmount - 1) % 2);
        this.statText.y = this.y + this.statIcon.h / 2 + ((this.statsAmount - 1) / 2 | 0);

        let isPercentage = stat === 'atkSpeed' ? '%' : '';
        this.statText.content = `+${item.stats[stat]}${isPercentage}`
        this.statText.color = this.statColors[stat];
        this.statText.render(context, tilesize, ratio)
    }
    render(context, tilesize, ratio, item) {
        context.globalAlpha = 0.8;
        this.statsAmount = 0;
        for (let stat in item.stats) {
            if (item.stats[stat] !== 0) {
                this.statsAmount++;
                this.renderStat(context, tilesize, ratio, item, stat);
            }
        }
        context.globalAlpha = 1;
    }
}
/** Returns an array of lines based on the maximum available width */
function getLines(ctx, text, font, maxWidth) {
    ctx.font = font;
    let words = text.split(" ");
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        let word = words[i];
        let width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}