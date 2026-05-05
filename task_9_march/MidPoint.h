#ifndef MIDPOINT_H
#define MIDPOINT_H
#include <GL/glut.h>

class MidPoint
{
public:
    void draw(int x1, int y1, int x2, int y2)
    {
        int dx = x2 - x1;
        int dy = y2 - y1;
        int d = dy - (dx / 2);
        int x = x1, y = y1;

        glBegin(GL_POINTS);
        glVertex2i(x, y);

        while (x < x2)
        {
            x++;
            if (d < 0)
            {
                d = d + dy;
            }
            else
            {
                d = d + (dy - dx);
                y++;
            }
            glVertex2i(x, y);
        }
        glEnd();
    }
};

#endif