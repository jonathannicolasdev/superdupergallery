-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "nick" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "roleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sequence" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPassword" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPassword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTag" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sequence" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "headline" TEXT,
    "bio" TEXT,
    "links" JSONB,
    "modeName" TEXT DEFAULT 'Default',
    "isPrimary" BOOLEAN DEFAULT true,
    "sequence" INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAvatarImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAvatarImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artwork" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "year" INTEGER,
    "medium" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "price" INTEGER,
    "isPublished" BOOLEAN DEFAULT false,
    "statusId" TEXT NOT NULL,
    "userId" TEXT,
    "artistId" TEXT,
    "exhibitionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artwork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtworkStatus" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sequence" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtworkStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtworkImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "artworkId" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtworkImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "bio" TEXT,
    "isPublished" BOOLEAN DEFAULT false,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtistImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "artistId" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtistImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exhibition" (
    "id" TEXT NOT NULL,
    "edition" INTEGER,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "description" TEXT,
    "isPublished" BOOLEAN DEFAULT false,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exhibition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExhibitionImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "exhibitionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExhibitionImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserToUserTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ArtistToExhibition" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User.username_unique" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User.phone_unique" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_roleId_idx" ON "User"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_symbol_key" ON "UserRole"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_name_key" ON "UserRole"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_sequence_key" ON "UserRole"("sequence");

-- CreateIndex
CREATE UNIQUE INDEX "UserPassword_userId_key" ON "UserPassword"("userId");

-- CreateIndex
CREATE INDEX "UserPassword_userId_idx" ON "UserPassword"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTag_symbol_key" ON "UserTag"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "UserTag_name_key" ON "UserTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserTag_sequence_key" ON "UserTag"("sequence");

-- CreateIndex
CREATE INDEX "UserProfile_userId_idx" ON "UserProfile"("userId");

-- CreateIndex
CREATE INDEX "UserAvatarImage_userId_idx" ON "UserAvatarImage"("userId");

-- CreateIndex
CREATE INDEX "Artwork_userId_idx" ON "Artwork"("userId");

-- CreateIndex
CREATE INDEX "Artwork_artistId_idx" ON "Artwork"("artistId");

-- CreateIndex
CREATE INDEX "Artwork_exhibitionId_idx" ON "Artwork"("exhibitionId");

-- CreateIndex
CREATE INDEX "Artwork_statusId_idx" ON "Artwork"("statusId");

-- CreateIndex
CREATE UNIQUE INDEX "ArtworkStatus_symbol_key" ON "ArtworkStatus"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "ArtworkStatus_name_key" ON "ArtworkStatus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ArtworkStatus_sequence_key" ON "ArtworkStatus"("sequence");

-- CreateIndex
CREATE INDEX "ArtworkImage_artworkId_idx" ON "ArtworkImage"("artworkId");

-- CreateIndex
CREATE INDEX "ArtworkImage_userId_idx" ON "ArtworkImage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_slug_key" ON "Artist"("slug");

-- CreateIndex
CREATE INDEX "Artist_userId_idx" ON "Artist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ArtistImage_artistId_key" ON "ArtistImage"("artistId");

-- CreateIndex
CREATE INDEX "ArtistImage_artistId_idx" ON "ArtistImage"("artistId");

-- CreateIndex
CREATE INDEX "ArtistImage_userId_idx" ON "ArtistImage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Exhibition_slug_key" ON "Exhibition"("slug");

-- CreateIndex
CREATE INDEX "Exhibition_userId_idx" ON "Exhibition"("userId");

-- CreateIndex
CREATE INDEX "ExhibitionImage_exhibitionId_idx" ON "ExhibitionImage"("exhibitionId");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToUserTag_AB_unique" ON "_UserToUserTag"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToUserTag_B_index" ON "_UserToUserTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ArtistToExhibition_AB_unique" ON "_ArtistToExhibition"("A", "B");

-- CreateIndex
CREATE INDEX "_ArtistToExhibition_B_index" ON "_ArtistToExhibition"("B");
