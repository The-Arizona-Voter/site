

#########################################

     2020 (Nov) Nationscape Data

########################################




library(foreign)
library(haven)
library(ggplot2)
library(ggrepel)
library(tidyverse)

nationsc<-read.csv("C:/Users/Bang/Dropbox/Nationscape/VOTER Panel Data Files/voter_panel.csv")


### ggpplot


library(ggplot2)

# Vote against trump

category<-c("Trump", "Vote against opponent", "Not asked")
df <- data.frame(
  category <- factor(category, levels = c("Trump", "Vote against opponent", "Not asked")),
  value=c(29.56, 5.71, 64.74)
)


ggplot(df, aes(x = "", y = value, fill = category)) + ggtitle("Vote Against Trump 2020 Nov") +
  ggeasy::easy_center_title() +
  geom_col(color = "black") +
  geom_label(aes(label = value),
             position = position_stack(vjust = 0.5),
             show.legend = FALSE) +
  coord_polar(theta = "y")+
  scale_fill_manual(values=c("#F8766D","#619CFF", "#00BA38"))+
  theme(axis.text = element_blank(),
        axis.ticks = element_blank(),
        axis.title = element_blank(),
        panel.grid = element_blank())




##### Vote choice in 2020 election


df <- data.frame(
  category=c("Donald Trump", "Joe Biden", "Others"),
  value=c(38.62,   58.25, 3.12)
)



ggplot(df, aes(x = "", y = value, fill = category)) + ggtitle("Vote choice 2020 Nov") +   ggeasy::easy_center_title() +
  geom_col(color = "black") +
  geom_label(aes(label = value),
             position = position_stack(vjust = 0.5),
             show.legend = FALSE) +
  coord_polar(theta = "y")+
  scale_fill_manual(values=c("#F8766D","#619CFF", "#00BA38"))+
  theme(axis.text = element_blank(),
        axis.ticks = element_blank(),
        axis.title = element_blank(),
        panel.grid = element_blank())




### abortion 

category <- c("Legal in all cases", "Legal in some cases and illegal in others", "Illegal in all cases", "Don't know")

df <- data.frame(
  category <- factor(category, levels= c("Legal in all cases", "Legal in some cases and illegal in others", "Illegal in all cases", "Don't know")),
  value=c(35.52, 45.84,  12.56,   6.07 )
)



ggplot(df, aes(x = "", y = value, fill = category)) + ggtitle("Abortion")+
  ggeasy::easy_center_title() +
  geom_col(color = "black") +
  geom_label(aes(label = value),
             position = position_stack(vjust = 0.5),
             show.legend = FALSE) +
  coord_polar(theta = "y")+
  scale_fill_discrete() +
  theme(axis.text = element_blank(),
        axis.ticks = element_blank(),
        axis.title = element_blank(),
        panel.grid = element_blank())



### Same sex marriage

category <- c("Support", "Oppose", "Don't know")

df <- data.frame(
  category <- factor(category, levels= c("Support", "Oppose", "Don't know")),
  value= c( 61.46, 26.44,   12.10  )
)



ggplot(df, aes(x = "", y = value, fill = category)) + ggtitle("Gay Marriage")+
  
  ggeasy::easy_center_title() +
  geom_col(color = "black") +
  geom_label(aes(label = value),
             position = position_stack(vjust = 0.5),
             show.legend = FALSE) +
  coord_polar(theta = "y")+
  scale_fill_discrete() +
  theme(axis.text = element_blank(),
        axis.ticks = element_blank(),
        axis.title = element_blank(),
        panel.grid = element_blank())




#### partisanship in 2020

category <- c("Democrat", "Republican", "Independent", "Nonpartisan")

df <- data.frame(
  category <- factor(category, levels= c("Democrat", "Republican", "Independent", "Nonpartisan")),
  value= c(39.45 ,24.92, 30.27, 5.36  )
)




ggplot(df, aes(x = "", y = value, fill = category)) + ggtitle("Partisanship in 2020 November")+
  ggeasy::easy_center_title() +
  geom_col(color = "black") +
  geom_label(aes(label = value),
             position = position_stack(vjust = 0.5),
             show.legend = FALSE) +
  coord_polar(theta = "y")+
  scale_fill_manual(values=c("#619CFF", "#F8766D", "#00BA38", "#008080"))+
  theme(axis.text = element_blank(),
        axis.ticks = element_blank(),
        axis.title = element_blank(),
        panel.grid = element_blank())





#### Political Ideology


category <- c("Very Liberal", "Liberal", "Moderate", "Conservative", "Very Conservative")

df <- data.frame(
  category <- factor(category, levels= c("Very Liberal", "Liberal", "Moderate", "Conservative", "Very Conservative")),
  value= c(11.81,  20.39, 36.92, 20.88, 9.99  )
)




ggplot(df, aes(x = "", y = value, fill = category)) + ggtitle("Ideology in 2020 November")+
  ggeasy::easy_center_title() +
  geom_col(color = "black") +
  geom_label(aes(label = value),
             position = position_stack(vjust = 0.5),
             show.legend = FALSE) +
  coord_polar(theta = "y")+
  scale_fill_manual(values=c("#0000FF",  "#619CFF", "#00BA38", "#F8766D", "#FF0000"))+
  theme(axis.text = element_blank(),
        axis.ticks = element_blank(),
        axis.title = element_blank(),
        panel.grid = element_blank())


### Favorability of Trump in 2020

df <- data.frame(att=c("Very favorable", "Somewhat favorable", "Somewhat unfavorable ", "Very unfavorable"),
                 freq=c( 1280,  554 , 259, 2762 ))
head(df)
p<-ggplot(data=df, aes(x=freq, y=att)) +
  geom_bar(stat="identity", fill= "#F8766D") + ggtitle("Favorability of Trump in 2020 November") +
  ggeasy::easy_center_title() + ylab("") + xlab("Frequency")


# Horizontal bar plot
p + coord_flip()




### How important do you think it is for Donald Trump to publicly acknowledge Joe Biden as the legitimate president of the country


att<-c("Very important", "Somewhat important", "Not too important", "Not at all important")

df <- data.frame(att<-factor(att, levels=c("Very important", "Somewhat important", "Not too important", "Not at all important")),
                 freq=c( 2017,
                         917,
                         523,
                         1112))
head(df)
p<-ggplot(data=df, aes(x=freq, y=att)) +
  geom_bar(stat="identity", fill= "#F8766D") + ggtitle("") +
  ggeasy::easy_center_title() + ylab("") + xlab("Frequency")


# Horizontal bar plot
p + coord_flip()



##### Since the election, President Trump has alleged that voter fraud took place. 
##### How appropriate do you think it is for the Trump campaign to file lawsuits challenging the election results in several states?




att<-c("Very appropriate", "Somewhat appropriate", "Somewhat inappropriate", "Very inappropriate")

df <- data.frame(att<-factor(att, levels=c("Very appropriate", "Somewhat appropriate", "Somewhat inappropriate", "Very inappropriate")),
                 freq=c( 1460,
                         429,
                         464,
                         2368))
head(df)
p<-ggplot(data=df, aes(x=freq, y=att)) +
  geom_bar(stat="identity", fill= "#F8766D") + ggtitle("") +
  ggeasy::easy_center_title() + ylab("") + xlab("Frequency")


# Horizontal bar plot
p + coord_flip()



### And how appropriate do you think the following actions would be? --President Trump never publicly concedes the election. 

att<-c("Very appropriate", "Somewhat appropriate", "Somewhat inappropriate", "Very inappropriate")

df <- data.frame(att<-factor(att, levels=c("Very appropriate", "Somewhat appropriate", "Somewhat inappropriate", "Very inappropriate")),
                 freq=c( 893,
                         301,
                         413,
                         2875))
head(df)
p<-ggplot(data=df, aes(x=freq, y=att)) +
  geom_bar(stat="identity", fill= "#F8766D") + ggtitle("") +
  ggeasy::easy_center_title() + ylab("") + xlab("Frequency")


# Horizontal bar plot
p + coord_flip()




#### And how appropriate do you think the following actions would be? --Republican legislators in states won by Joe Biden try to assign their state's electoral votes to Donald Trump. 

att<-c("Very appropriate", "Somewhat appropriate", "Somewhat inappropriate", "Very inappropriate")

df <- data.frame(att<-factor(att, levels=c("Very appropriate", "Somewhat appropriate", "Somewhat inappropriate", "Very inappropriate")),
                 freq=c( 694,
                         276,
                         274,
                         3012))
head(df)
p<-ggplot(data=df, aes(x=freq, y=att)) +
  geom_bar(stat="identity", fill= "#F8766D") + ggtitle("") +
  ggeasy::easy_center_title() + ylab("") + xlab("Frequency")


# Horizontal bar plot
p + coord_flip()





### And how appropriate do you think the following actions would be? --Republican legislators in states won by Joe Biden try to assign their state's electoral votes to Donald Trump. 



att<-c("Very important", "Somewhat important", "Not too important", "Not at all important")

df <- data.frame(att<-factor(att, levels=c("Very important", "Somewhat important", "Not too important", "Not at all important")),
                 freq=c( 2017,
                         917,
                         523,
                         1112))
head(df)
p<-ggplot(data=df, aes(x=freq, y=att)) +
  geom_bar(stat="identity", fill= "#F8766D") + ggtitle("") +
  ggeasy::easy_center_title() + ylab("") + xlab("Frequency")


# Horizontal bar plot
p + coord_flip()




### How important do you think it is for Donald Trump to publicly acknowledge Joe Biden as the legitimate president of the country?


att<-c("Very confident", "Somewhat confident", "Not too confident", "Not at all confident")

df <- data.frame(att<-factor(att, levels=c("Very confident", "Somewhat confident", "Not too confident", "Not at all confident")),
                 freq=c( 2686,
                         858,
                         362,
                         629))
head(df)
p<-ggplot(data=df, aes(x=freq, y=att)) +
  geom_bar(stat="identity", fill= "#F8766D") + ggtitle("") +
  ggeasy::easy_center_title() + ylab("") + xlab("Frequency")


# Horizontal bar plot
p + coord_flip()



#### How confident are you that your vote in the 2020 election was accurately counted?


att<-c("Very confident", "Somewhat confident", "Not too confident", "Not at all confident")

df <- data.frame(att<-factor(att, levels=c("Very confident", "Somewhat confident", "Not too confident", "Not at all confident")),
                 freq=c( 2789,
                         1195,
                         479,
                         479))
head(df)
p<-ggplot(data=df, aes(x=freq, y=att)) +
  geom_bar(stat="identity", fill= "#F8766D") + ggtitle("") +
  ggeasy::easy_center_title() + ylab("") + xlab("Frequency")


# Horizontal bar plot
p + coord_flip()



### How confident are you that votes across the United States were counted as voters intended in the elections this November?

att<-c("Very confident", "Somewhat confident", "Not too confident", "Not at all confident")

df <- data.frame(att<-factor(att, levels=c("Very confident", "Somewhat confident", "Not too confident", "Not at all confident")),
                 freq=c( 2290,
                         922,
                         563,
                         1167))
head(df)
p<-ggplot(data=df, aes(x=freq, y=att)) +
  geom_bar(stat="identity", fill= "#F8766D") + ggtitle("") +
  ggeasy::easy_center_title() + ylab("") + xlab("Frequency")


# Horizontal bar plot
p + coord_flip()








#######################################

      2020 CMPS

######################################

### registration status

category<-c("Registered", "Not registered", "Not eligible")
df <- data.frame(
  category <- factor(category, levels = c("Registered", "Not registered", "Not eligible")),
  value=c(68.03, 24.62,  7.34)
)


ggplot(df, aes(x = "", y = value, fill = category)) + ggtitle("Registration status in the 2020 election") +
  ggeasy::easy_center_title() +
  geom_col(color = "black") +
  geom_label(aes(label = value),
             position = position_stack(vjust = 0.5),
             show.legend = FALSE) +
  coord_polar(theta = "y")+
  scale_fill_manual(values=c("#F8766D","#619CFF", "#00BA38"))+
  theme(axis.text = element_blank(),
        axis.ticks = element_blank(),
        axis.title = element_blank(),
        panel.grid = element_blank())




### Vote choice in 2020

category<-c("Donald Trump", "Joe Biden")
df <- data.frame(
  category <- factor(category, levels = c("Donald Trump", "Joe Biden")),
  value=c(36.39 , 63.61)
)


ggplot(df, aes(x = "", y = value, fill = category)) + ggtitle("Vote choice in the 2020 election") +
  ggeasy::easy_center_title() +
  geom_col(color = "black") +
  geom_label(aes(label = value),
             position = position_stack(vjust = 0.5),
             show.legend = FALSE) +
  coord_polar(theta = "y")+
  scale_fill_manual(values=c("#F8766D","#619CFF"))+
  theme(axis.text = element_blank(),
        axis.ticks = element_blank(),
        axis.title = element_blank(),
        panel.grid = element_blank())



### Belief in voting fraud in 2020 election

category<-c("Definitely fraud", "Probably fraud", "Some fraud", "Not much fraud", "Definitely no fraud")
df <- data.frame(
  category <- factor(category, levels = c("Definitely fraud", "Probably fraud", "Some fraud", "Not much fraud", "Definitely no fraud")),
  value=c( 17.09, 10.76,  13.29,  13.92, 44.94 )
)


ggplot(df, aes(x = "", y = value, fill = category)) + ggtitle("Belief in voting fraud in 2020 election") +
  ggeasy::easy_center_title() +
  geom_col(color = "black") +
  geom_label(aes(label = value),
             position = position_stack(vjust = 0.5),
             show.legend = FALSE) +
  coord_polar(theta = "y")+
  scale_fill_discrete() +
  theme(axis.text = element_blank(),
        axis.ticks = element_blank(),
        axis.title = element_blank(),
        panel.grid = element_blank())





## covid-19
#Q371



category<-c("Within Reason", "Without reason")
df <- data.frame(
  category <- factor(category, levels = c("Within Reason", "Without reason")),
  value=c( 74.73 , 25.27 )
)


ggplot(df, aes(x = "", y = value, fill = category)) + ggtitle("Attitude towards Governors' Authority on Mask Requirement") +
  ggeasy::easy_center_title() +
  geom_col(color = "black") +
  geom_label(aes(label = value),
             position = position_stack(vjust = 0.5),
             show.legend = FALSE) +
  coord_polar(theta = "y")+
  scale_fill_discrete() +
  theme(axis.text = element_blank(),
        axis.ticks = element_blank(),
        axis.title = element_blank(),
        panel.grid = element_blank())



category<-c("Less Active", "More Active", "No Effective")
df <- data.frame(
  category <- factor(category, levels = c("Less Active", "More Active", "No Effective")),
  value=c(25, 18, 57)
)


ggplot(df, aes(x = "", y = value, fill = category)) + ggtitle("Covid-19 and Engagement in Politics") +
  ggeasy::easy_center_title() +
  geom_col(color = "black") +
  geom_label(aes(label = value),
             position = position_stack(vjust = 0.5),
             show.legend = FALSE) +
  coord_polar(theta = "y")+
  scale_fill_discrete() +
  theme(axis.text = element_blank(),
        axis.ticks = element_blank(),
        axis.title = element_blank(),
        panel.grid = element_blank())



category<-c("Personal or Family Health", "Personal or Family Finance", "Social Changes", "New Policies & Issues")
df <- data.frame(
  category <- factor(category, levels = c("Personal or Family Health", "Personal or Family Finance", "Social Changes", "New Policies & Issues")),
  value=c(32, 21, 33, 13)
)


ggplot(df, aes(x = "", y = value, fill = category)) + ggtitle("What made People Politically Active in 2020") +
  ggeasy::easy_center_title() +
  geom_col(color = "black") +
  geom_label(aes(label = value),
             position = position_stack(vjust = 0.5),
             show.legend = FALSE) +
  coord_polar(theta = "y")+
  scale_fill_discrete() +
  theme(axis.text = element_blank(),
        axis.ticks = element_blank(),
        axis.title = element_blank(),
        panel.grid = element_blank())






#Q372



category<-c("Required by government", "Required by the places", "No requirement")
df <- data.frame(
  category <- factor(category, levels = c("Required by government", "Required by the places", "No requirement")),
  value=c( 41.42, 43.22,   15.36  )
)


ggplot(df, aes(x = "", y = value, fill = category)) + ggtitle("Mask Requirement in Public") +
  ggeasy::easy_center_title() +
  geom_col(color = "black") +
  geom_label(aes(label = value),
             position = position_stack(vjust = 0.5),
             show.legend = FALSE) +
  coord_polar(theta = "y")+
  scale_fill_discrete() +
  theme(axis.text = element_blank(),
        axis.ticks = element_blank(),
        axis.title = element_blank(),
        panel.grid = element_blank())





#### Ideology


library(ggplot2)


ideology <- c(rep("Very Liberal" , 4) , rep("Somewhat Liberal" , 4) , rep("Moderate" , 4) , rep("Somewhat Conservative" , 4),rep("Very Conservative" , 4) )
group <- rep(c("White" , "Latino" , "Black", "Asian") , 5)
value <- c(7, 15, 7, 10,
           17, 35, 10, 14,
           33, 71, 21, 29,
           29, 16, 6, 8,
           21, 19, 3, 10)

data <- data.frame(
  ideology<- factor(ideology, levels = c("Very Liberal", "Somewhat Liberal", "Moderate", "Somewhat Conservative", "Very Conservative")),
  group<- factor(group, levels=c("White" , "Latino" , "Black", "Asian")), value)

# Stacked
ggplot(data, aes(fill=group, y=value, x=ideology)) +
  geom_bar(position="stack", stat="identity")+ggtitle("Political Ideology by Groups")+
  ggeasy::easy_center_title() + xlab("") + ylab("")




#### Party ID

pid <- c(rep("Strong Democrat" , 4) , rep("Democrat" , 4) , rep("Weak Democrat" , 4) , rep("Independent" , 4),
         rep("Weak Republican" , 4), rep("Republican" , 4), rep("Strong Republican", 4))
group <- rep(c("White" , "Latino" , "Black", "Asian") , 7)
value <- c(13, 46, 24, 15,
           14, 29, 7, 13,
           6, 14, 5, 9,
           15, 24, 8, 14,
           10, 7, 2, 2,
           15, 14, 0, 7,
           37, 23, 5, 10)



data <- data.frame(
  pid<- factor(pid, levels = c("Strong Democrat", "Democrat", "Weak Democrat",
                               "Independent", "Weak Republican", "Republican", "Strong Republican")),
  group<- factor(group, levels=c("White" , "Latino" , "Black", "Asian")), value)

# Stacked
ggplot(data, aes(fill=group, y=value, x=pid)) +
  geom_bar(position="stack", stat="identity")+ggtitle("Partisanship by Groups")+
  ggeasy::easy_center_title() + xlab("") + ylab("")




#### Educational Levels



education<- c(rep("Grade Sch" , 4) , rep("Some Hi Sch" , 4), rep("High Sch", 4), rep("Some Col" , 4) , rep("AA Degree" , 4),
              rep("Bachelors" , 4), rep("Post-Grad" , 4))
group <- rep(c("White" , "Latino" , "Black", "Asian") , 7)
value <- c(0, 2.37, 1.82, 1.37,
           0.88, 5.92, 3.64, 0,
           9.73, 16.57, 20, 10.96,
           29.2, 28.99, 32.73, 13.7,
           15.93, 14.2, 10.91, 2.74,
           21.24, 19.53, 12.73, 35.62,
           23.01, 12.43, 18.18, 35.62)


data <- data.frame(
  education<- factor(education, levels = c("Grade Sch", "Some Hi Sch", "High Sch",
                                           "Some Col", "AA Degree", "Bachelors", "Post-Grad")),
  group<- factor(group, levels=c("White" , "Latino" , "Black", "Asian")), value)

# Stacked
ggplot(data, aes(fill=group, y=value, x=education)) +
  geom_bar(position="stack", stat="identity")+ggtitle("Educational Attainment by Groups")+
  ggeasy::easy_center_title() + xlab("") + ylab("")









